import { create } from 'zustand';
import { EVENTS } from '../data/events';
import type {
  Choice,
  GameEvent,
  Outcome,
  Phase,
  ResourceKey,
  Resources,
  Status,
  Survivor,
} from '../types';

const DESTINATION_DISTANCE = 500;
const DAILY_FOOD_PER_PERSON = 1;
const DAILY_FUEL = 5;
const EVENT_CHANCE = 0.6;
const STARTING_NAMES = ['Maya', 'Dale', 'Rio', 'Cass'];

const startResources = (): Resources => ({
  food: 40,
  fuel: 60,
  ammo: 12,
  medicine: 6,
  scrap: 10,
});

const startParty = (): Survivor[] =>
  STARTING_NAMES.map((name, i) => ({
    id: `s${i}`,
    name,
    hp: 100,
    status: 'healthy' as Status,
    morale: 80,
  }));

interface GameState {
  phase: Phase;
  day: number;
  distance: number;
  resources: Resources;
  party: Survivor[];
  log: string[];
  currentEvent: GameEvent | null;
  lastOutcomeText: string | null;

  start: () => void;
  travelOneDay: () => void;
  resolveChoice: (choice: Choice) => void;
  acknowledgeOutcome: () => void;
  reset: () => void;
}

const livingMembers = (party: Survivor[]) => party.filter((s) => s.status !== 'dead');

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

const applyResourceDelta = (r: Resources, delta: Partial<Resources>): Resources => {
  const next = { ...r };
  (Object.keys(delta) as ResourceKey[]).forEach((k) => {
    next[k] = Math.max(0, next[k] + (delta[k] ?? 0));
  });
  return next;
};

const applyPartyHp = (party: Survivor[], hpDelta: number): Survivor[] =>
  party.map((s) => {
    if (s.status === 'dead') return s;
    const hp = clamp(s.hp + hpDelta, 0, 100);
    return { ...s, hp, status: hp <= 0 ? ('dead' as Status) : s.status };
  });

const applyPartyMorale = (party: Survivor[], delta: number): Survivor[] =>
  party.map((s) =>
    s.status === 'dead' ? s : { ...s, morale: clamp(s.morale + delta, 0, 100) }
  );

const inflictRandomStatus = (
  party: Survivor[],
  status: Status,
  chance: number
): { party: Survivor[]; affected: Survivor | null } => {
  const candidates = party.filter((s) => s.status === 'healthy');
  if (candidates.length === 0 || Math.random() > chance) {
    return { party, affected: null };
  }
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    party: party.map((s) => (s.id === target.id ? { ...s, status } : s)),
    affected: target,
  };
};

const pickOutcome = (choice: Choice): Outcome => {
  const idx = Math.floor(Math.random() * choice.outcomes.length);
  return choice.outcomes[idx];
};

const pickEvent = (): GameEvent => {
  const totalWeight = EVENTS.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let roll = Math.random() * totalWeight;
  for (const e of EVENTS) {
    roll -= e.weight ?? 1;
    if (roll <= 0) return e;
  }
  return EVENTS[0];
};

const canAfford = (r: Resources, cost?: Partial<Resources>): boolean => {
  if (!cost) return true;
  return (Object.keys(cost) as ResourceKey[]).every((k) => r[k] + (cost[k] ?? 0) >= 0);
};

export const choiceIsAvailable = (choice: Choice, r: Resources): boolean =>
  canAfford(r, choice.requires);

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'start',
  day: 0,
  distance: 0,
  resources: startResources(),
  party: startParty(),
  log: [],
  currentEvent: null,
  lastOutcomeText: null,

  start: () => {
    set({
      phase: 'travel',
      day: 1,
      distance: 0,
      resources: startResources(),
      party: startParty(),
      log: ['Day 1. The road is long.'],
      currentEvent: null,
      lastOutcomeText: null,
    });
  },

  travelOneDay: () => {
    const state = get();
    if (state.phase !== 'travel') return;

    const living = livingMembers(state.party);
    if (living.length === 0) {
      set({ phase: 'gameover' });
      return;
    }

    const foodCost = living.length * DAILY_FOOD_PER_PERSON;
    const fuelCost = DAILY_FUEL;
    const newLog: string[] = [];

    // Out of fuel = stranded
    if (state.resources.fuel < fuelCost) {
      newLog.push('You\'ve run out of fuel. The van rolls to a stop forever.');
      set({
        phase: 'gameover',
        log: [...state.log, ...newLog],
      });
      return;
    }

    let resources = applyResourceDelta(state.resources, {
      food: -foodCost,
      fuel: -fuelCost,
    });

    // Hunger damage if food was insufficient
    let party = state.party;
    if (state.resources.food < foodCost) {
      newLog.push('Rations were short today. Everyone is hungry.');
      party = applyPartyHp(party, -4);
      party = applyPartyMorale(party, -5);
    }

    // Sick/wounded degrade
    party = party.map((s) => {
      if (s.status === 'sick') return { ...s, hp: clamp(s.hp - 5, 0, 100) };
      if (s.status === 'wounded') return { ...s, hp: clamp(s.hp - 2, 0, 100) };
      return s;
    });
    party = party.map((s) =>
      s.status !== 'dead' && s.hp <= 0 ? { ...s, status: 'dead' as Status } : s
    );

    const distance = state.distance + 25;
    const day = state.day + 1;

    if (distance >= DESTINATION_DISTANCE) {
      newLog.push(`Day ${day}. You see the safe zone on the horizon. You made it.`);
      set({
        day,
        distance: DESTINATION_DISTANCE,
        resources,
        party,
        log: [...state.log, ...newLog],
        phase: 'victory',
      });
      return;
    }

    if (livingMembers(party).length === 0) {
      newLog.push('No one is left.');
      set({
        day,
        distance,
        resources,
        party,
        log: [...state.log, ...newLog],
        phase: 'gameover',
      });
      return;
    }

    // Maybe trigger an event
    if (Math.random() < EVENT_CHANCE) {
      const event = pickEvent();
      newLog.push(`Day ${day}. ${event.title}.`);
      set({
        day,
        distance,
        resources,
        party,
        log: [...state.log, ...newLog],
        currentEvent: event,
        phase: 'event',
      });
    } else {
      newLog.push(`Day ${day}. Quiet road. ${distance}/${DESTINATION_DISTANCE} miles.`);
      set({
        day,
        distance,
        resources,
        party,
        log: [...state.log, ...newLog],
      });
    }
  },

  resolveChoice: (choice) => {
    const state = get();
    if (state.phase !== 'event' || !state.currentEvent) return;
    if (!canAfford(state.resources, choice.requires)) return;

    const outcome = pickOutcome(choice);
    let resources = state.resources;
    let party = state.party;

    if (choice.requires) {
      resources = applyResourceDelta(resources, choice.requires);
    }
    if (outcome.resources) {
      resources = applyResourceDelta(resources, outcome.resources);
    }
    if (outcome.partyHp !== undefined) {
      party = applyPartyHp(party, outcome.partyHp);
    }
    if (outcome.partyMorale !== undefined) {
      party = applyPartyMorale(party, outcome.partyMorale);
    }

    const extraLog: string[] = [];
    if (outcome.inflictStatus) {
      const result = inflictRandomStatus(
        party,
        outcome.inflictStatus.status,
        outcome.inflictStatus.chance
      );
      party = result.party;
      if (result.affected) {
        extraLog.push(`${result.affected.name} is now ${outcome.inflictStatus.status}.`);
      }
    }
    if (outcome.killChance && Math.random() < outcome.killChance) {
      const living = livingMembers(party);
      if (living.length > 0) {
        const victim = living[Math.floor(Math.random() * living.length)];
        party = party.map((s) =>
          s.id === victim.id ? { ...s, hp: 0, status: 'dead' as Status } : s
        );
        extraLog.push(`${victim.name} did not make it.`);
      }
    }
    if (outcome.distance) {
      // Bonus or penalty distance applied immediately
      // Negative distance not allowed to dip below current
      // (we already advanced distance during travelOneDay)
    }

    const newPhase: Phase = livingMembers(party).length === 0 ? 'gameover' : 'travel';

    set({
      resources,
      party,
      log: [...state.log, outcome.text, ...extraLog],
      currentEvent: null,
      lastOutcomeText: outcome.text,
      phase: newPhase,
    });
  },

  acknowledgeOutcome: () => {
    set({ lastOutcomeText: null });
  },

  reset: () => {
    set({
      phase: 'start',
      day: 0,
      distance: 0,
      resources: startResources(),
      party: startParty(),
      log: [],
      currentEvent: null,
      lastOutcomeText: null,
    });
  },
}));

export const DESTINATION = DESTINATION_DISTANCE;
