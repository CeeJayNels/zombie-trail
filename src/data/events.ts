import type { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  {
    id: 'abandoned-store',
    title: 'Abandoned Convenience Store',
    description:
      'Half the windows are smashed. You can hear something shuffling inside, but the shelves still have boxes on them.',
    choices: [
      {
        label: 'Sneak in quietly',
        outcomes: [
          { text: 'You slip in and out with canned goods.', resources: { food: 12 } },
          {
            text: 'A zombie spots you. You scrape by but get a nasty bite.',
            resources: { food: 6 },
            inflictStatus: { status: 'wounded', chance: 0.6 },
          },
        ],
      },
      {
        label: 'Go in guns blazing',
        requires: { ammo: 4 },
        outcomes: [
          {
            text: 'You clear it out and loot at your leisure.',
            resources: { food: 18, ammo: -4, scrap: 3 },
          },
        ],
      },
      { label: 'Skip it', outcomes: [{ text: 'You keep driving.' }] },
    ],
  },
  {
    id: 'stranger-roadside',
    title: 'Stranger at the Roadside',
    description:
      'A man waves you down. He looks unarmed, but you can\'t see what\'s in his pack.',
    choices: [
      {
        label: 'Offer food',
        requires: { food: 5 },
        outcomes: [
          {
            text: 'He gratefully trades you medicine.',
            resources: { food: -5, medicine: 4 },
            partyMorale: 5,
          },
          {
            text: 'He takes the food and runs. Bastard.',
            resources: { food: -5 },
            partyMorale: -5,
          },
        ],
      },
      {
        label: 'Drive past',
        outcomes: [{ text: 'You leave him behind.', partyMorale: -2 }],
      },
      {
        label: 'Rob him',
        requires: { ammo: 1 },
        outcomes: [
          {
            text: 'He hands over a small stash. The party is uneasy.',
            resources: { ammo: -1, food: 4, scrap: 2 },
            partyMorale: -8,
          },
        ],
      },
    ],
  },
  {
    id: 'flat-tire',
    title: 'Flat Tire',
    description: 'The van lurches. A blown tire — there\'s shrapnel all over the road.',
    choices: [
      {
        label: 'Patch it with scrap',
        requires: { scrap: 4 },
        outcomes: [{ text: 'You get rolling again in an hour.', resources: { scrap: -4 } }],
      },
      {
        label: 'Limp along on the rim',
        outcomes: [
          {
            text: 'You make slow progress and burn extra fuel.',
            resources: { fuel: -8 },
            distance: -10,
          },
        ],
      },
    ],
  },
  {
    id: 'horde',
    title: 'A Horde Crosses the Road',
    description: 'Dozens of them, shambling across the highway ahead.',
    choices: [
      {
        label: 'Wait it out',
        outcomes: [
          { text: 'They eventually pass. You lose half a day.', resources: { food: -3 } },
        ],
      },
      {
        label: 'Plow through',
        requires: { fuel: 6 },
        outcomes: [
          {
            text: 'The van punches through but takes a beating.',
            resources: { fuel: -6, scrap: -2 },
            partyHp: -5,
          },
          {
            text: 'You smash through and barely slow down.',
            resources: { fuel: -6 },
            distance: 8,
          },
        ],
      },
      {
        label: 'Pick them off',
        requires: { ammo: 8 },
        outcomes: [
          { text: 'You clear a path methodically.', resources: { ammo: -8 }, partyMorale: 3 },
        ],
      },
    ],
  },
  {
    id: 'sickness',
    title: 'Someone\'s Burning Up',
    description: 'One of you wakes up shivering and feverish.',
    choices: [
      {
        label: 'Use medicine',
        requires: { medicine: 2 },
        outcomes: [
          {
            text: 'The fever breaks by morning.',
            resources: { medicine: -2 },
            partyHp: 5,
          },
        ],
      },
      {
        label: 'Tough it out',
        outcomes: [
          {
            text: 'It spreads. Two of you feel awful.',
            inflictStatus: { status: 'sick', chance: 0.7 },
            partyMorale: -4,
          },
        ],
      },
    ],
  },
  {
    id: 'gas-station',
    title: 'Working Gas Pump',
    description: 'A pump with a hand crank. Someone got it running again.',
    choices: [
      {
        label: 'Fill up',
        outcomes: [{ text: 'Tank topped off.', resources: { fuel: 25 } }],
      },
      {
        label: 'Fill up and search the office',
        outcomes: [
          {
            text: 'You find fuel and a small toolkit.',
            resources: { fuel: 25, scrap: 5 },
          },
          {
            text: 'A trap — you take fire while pumping.',
            resources: { fuel: 10, ammo: -3 },
            partyHp: -8,
          },
        ],
      },
    ],
  },
  {
    id: 'survivor-camp',
    title: 'Friendly Camp',
    description: 'A small camp invites you in for the night. They look tired but kind.',
    choices: [
      {
        label: 'Trade scrap for medicine',
        requires: { scrap: 5 },
        outcomes: [
          { text: 'A fair trade.', resources: { scrap: -5, medicine: 3 }, partyMorale: 4 },
        ],
      },
      {
        label: 'Rest the night',
        outcomes: [
          { text: 'You sleep well. Wounds heal a little.', partyHp: 8, partyMorale: 6 },
        ],
      },
      { label: 'Move on', outcomes: [{ text: 'You wave and keep driving.' }] },
    ],
  },
  {
    id: 'storm',
    title: 'Lightning Storm',
    description: 'Sheets of rain. Visibility is zero.',
    choices: [
      {
        label: 'Push through',
        outcomes: [
          {
            text: 'You make it but burn extra fuel.',
            resources: { fuel: -10 },
            distance: 5,
          },
          {
            text: 'You crash into a guardrail.',
            resources: { fuel: -10, scrap: -3 },
            partyHp: -6,
          },
        ],
      },
      {
        label: 'Pull over and wait',
        outcomes: [{ text: 'You lose half a day but stay safe.' }],
      },
    ],
  },
];
