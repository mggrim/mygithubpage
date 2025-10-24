import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { GameSetup } from './components/game/GameSetup';
import { Dashboard } from './components/game/Dashboard';
import { getRandomDecisions } from './data/decisions';

function App() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const { phase, currentQuarter, setPhase, setCurrentDecisions, setMarket } =
    useGameStore();

  // Game loop - simulate quarter progression
  useEffect(() => {
    if (phase === 'information' && playerId) {
      // Show information phase for 5 seconds, then move to decision
      const timer = setTimeout(() => {
        // Generate decisions for this quarter
        const decisions = getRandomDecisions(1, currentQuarter + 1);
        setCurrentDecisions(decisions);
        setPhase('decision');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [phase, currentQuarter, playerId, setPhase, setCurrentDecisions]);

  // Simulate market evolution
  useEffect(() => {
    if (currentQuarter > 0) {
      // Update hype cycle based on quarter
      const stages = ['Emerging', 'Climbing', 'Peak Hype', 'Trough of Disillusionment', 'Plateau of Productivity'];
      const stageIndex = Math.min(Math.floor(currentQuarter / 3), stages.length - 1);

      // Determine bubble risk based on quarter
      let bubbleRisk: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
      if (currentQuarter >= 6 && currentQuarter <= 8) bubbleRisk = 'AMBER';
      if (currentQuarter >= 9 && currentQuarter <= 10) bubbleRisk = 'RED';

      setMarket({
        hypeCycleStage: stages[stageIndex] as any,
        hypeCyclePosition: (currentQuarter / 12) * 100,
        bubbleRiskScore: bubbleRisk,
        bubbleGauges: {
          economicStrain: bubbleRisk,
          industryStrain: bubbleRisk === 'RED' ? 'RED' : bubbleRisk === 'AMBER' ? 'AMBER' : 'GREEN',
          revenueGrowth: 'GREEN',
          valuationHeat: bubbleRisk,
          fundingQuality: bubbleRisk === 'RED' ? 'AMBER' : 'GREEN',
        },
        competitorActivity: currentQuarter >= 6 ? 'HIGH' : currentQuarter >= 3 ? 'MEDIUM' : 'LOW',
      });
    }
  }, [currentQuarter, setMarket]);

  const handleGameStart = (newPlayerId: string) => {
    setPlayerId(newPlayerId);
  };

  if (!playerId) {
    return <GameSetup onStart={handleGameStart} />;
  }

  return <Dashboard playerId={playerId} />;
}

export default App;
