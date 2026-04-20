import { useGameStore } from '../store/gameStore';
import { Illustration } from './Illustration';

export function StartScreen() {
  const start = useGameStore((s) => s.start);
  return (
    <div className="start-screen">
      <Illustration
        kind="scenery"
        name="start-hero"
        alt="title"
        className="hero"
      />
      <h1>Organ Trail</h1>
      <p>
        Lead four survivors 500 miles to the safe zone. Manage food, fuel, ammo, medicine,
        and scrap. Every choice has a cost.
      </p>
      <button className="primary" onClick={start}>
        Begin journey
      </button>
    </div>
  );
}
