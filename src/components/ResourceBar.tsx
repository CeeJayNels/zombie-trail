import { useGameStore } from '../store/gameStore';
import type { ResourceKey } from '../types';
import { Illustration } from './Illustration';

const LABELS: Record<ResourceKey, string> = {
  food: 'Food',
  fuel: 'Fuel',
  ammo: 'Ammo',
  medicine: 'Meds',
  scrap: 'Scrap',
};

export function ResourceBar() {
  const resources = useGameStore((s) => s.resources);
  return (
    <div className="resource-bar">
      {(Object.keys(LABELS) as ResourceKey[]).map((k) => (
        <div key={k} className="resource">
          <span className="resource-label">
            <Illustration
              kind="icon"
              name={k}
              alt={LABELS[k]}
              className="resource-icon"
            />
            {LABELS[k]}
          </span>
          <span className="resource-value">{resources[k]}</span>
        </div>
      ))}
    </div>
  );
}
