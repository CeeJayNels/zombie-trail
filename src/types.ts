export type ResourceKey = 'food' | 'fuel' | 'ammo' | 'medicine' | 'scrap';

export type Resources = Record<ResourceKey, number>;

export type Status = 'healthy' | 'wounded' | 'sick' | 'dead';

export interface Survivor {
  id: string;
  name: string;
  hp: number;
  status: Status;
  morale: number;
}

export interface Outcome {
  text: string;
  resources?: Partial<Resources>;
  distance?: number;
  partyHp?: number;
  partyMorale?: number;
  inflictStatus?: { status: Status; chance: number };
  killChance?: number;
}

export interface Choice {
  label: string;
  requires?: Partial<Resources>;
  outcomes: Outcome[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  weight?: number;
}

export type Phase = 'start' | 'travel' | 'event' | 'gameover' | 'victory';
