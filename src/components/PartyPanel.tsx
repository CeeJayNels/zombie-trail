import { useGameStore } from '../store/gameStore';
import type { Status } from '../types';
import { Illustration } from './Illustration';

const STATUS_CLASS: Record<Status, string> = {
  healthy: 'status-healthy',
  wounded: 'status-wounded',
  sick: 'status-sick',
  dead: 'status-dead',
};

export function PartyPanel() {
  const party = useGameStore((s) => s.party);
  return (
    <div className="party-panel">
      <h3>Party</h3>
      {party.map((s) => (
        <div key={s.id} className={`survivor ${STATUS_CLASS[s.status]}`}>
          <div className="survivor-row">
            <Illustration
              kind="portrait"
              name={s.status}
              alt={s.status}
              className="portrait"
            />
            <span className="survivor-name">{s.name}</span>
            <span className="survivor-status">{s.status}</span>
          </div>
          <div className="bar">
            <div className="bar-fill bar-hp" style={{ width: `${s.hp}%` }} />
          </div>
          <div className="bar">
            <div className="bar-fill bar-morale" style={{ width: `${s.morale}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
