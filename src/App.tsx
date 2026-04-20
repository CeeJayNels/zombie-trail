import { useGameStore } from './store/gameStore';
import { ResourceBar } from './components/ResourceBar';
import { PartyPanel } from './components/PartyPanel';
import { JourneyScreen } from './components/JourneyScreen';
import { EventScreen } from './components/EventScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';

export default function App() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'start') return <StartScreen />;
  if (phase === 'gameover') return <GameOverScreen won={false} />;
  if (phase === 'victory') return <GameOverScreen won={true} />;

  return (
    <div className="game-layout">
      <header className="topbar">
        <ResourceBar />
      </header>
      <aside className="sidebar">
        <PartyPanel />
      </aside>
      <main className="main">
        {phase === 'event' ? <EventScreen /> : <JourneyScreen />}
      </main>
    </div>
  );
}
