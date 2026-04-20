import { DESTINATION, useGameStore } from '../store/gameStore';
import { Illustration } from './Illustration';

export function JourneyScreen() {
  const day = useGameStore((s) => s.day);
  const distance = useGameStore((s) => s.distance);
  const log = useGameStore((s) => s.log);
  const travel = useGameStore((s) => s.travelOneDay);

  const pct = Math.min(100, (distance / DESTINATION) * 100);

  return (
    <div className="journey-screen">
      <Illustration
        kind="scenery"
        name="road"
        alt="road ahead"
        className="journey-scenery"
      />
      <div className="journey-header">
        <div>Day {day}</div>
        <div>
          {distance} / {DESTINATION} mi
        </div>
      </div>
      <div className="bar journey-bar">
        <div className="bar-fill bar-distance" style={{ width: `${pct}%` }} />
      </div>
      <button className="primary" onClick={travel}>
        Travel one day
      </button>
      <div className="log">
        {log
          .slice(-12)
          .map((line, i) => (
            <div key={i} className="log-line">
              {line}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
