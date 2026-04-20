import { useGameStore } from '../store/gameStore';
import { Illustration } from './Illustration';

export function GameOverScreen({ won }: { won: boolean }) {
  const day = useGameStore((s) => s.day);
  const distance = useGameStore((s) => s.distance);
  const party = useGameStore((s) => s.party);
  const reset = useGameStore((s) => s.reset);

  const survivors = party.filter((s) => s.status !== 'dead');

  return (
    <div className="gameover-screen">
      <Illustration
        kind="scenery"
        name={won ? 'start-hero' : 'tombstone'}
        alt={won ? 'you made it' : 'game over'}
        className="endscreen"
      />
      <h1>{won ? 'You Made It' : 'Game Over'}</h1>
      <p>
        {won
          ? `After ${day} days and ${distance} miles, ${survivors.length} of you reached the safe zone.`
          : `The journey ended on day ${day} after ${distance} miles.`}
      </p>
      <ul className="memorial">
        {party.map((s) => (
          <li key={s.id}>
            {s.name} — {s.status === 'dead' ? 'died on the road' : 'survived'}
          </li>
        ))}
      </ul>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
