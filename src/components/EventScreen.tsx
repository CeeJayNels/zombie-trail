import { choiceIsAvailable, useGameStore } from '../store/gameStore';
import type { ResourceKey } from '../types';
import { Illustration } from './Illustration';

const formatRequires = (req: Partial<Record<ResourceKey, number>>) =>
  (Object.keys(req) as ResourceKey[])
    .map((k) => `${Math.abs(req[k] ?? 0)} ${k}`)
    .join(', ');

export function EventScreen() {
  const event = useGameStore((s) => s.currentEvent);
  const resources = useGameStore((s) => s.resources);
  const resolve = useGameStore((s) => s.resolveChoice);

  if (!event) return null;

  return (
    <div className="event-screen">
      <Illustration
        kind="event"
        name={event.id}
        alt={event.title}
        className="event-illustration"
      />
      <h2>{event.title}</h2>
      <p className="event-description">{event.description}</p>
      <div className="choices">
        {event.choices.map((c, i) => {
          const available = choiceIsAvailable(c, resources);
          return (
            <button
              key={i}
              className="choice"
              disabled={!available}
              onClick={() => resolve(c)}
            >
              <span>{c.label}</span>
              {c.requires && (
                <span className="choice-cost">cost: {formatRequires(c.requires)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
