import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { GameSetup } from './components/game/GameSetup';
import { GameIntro } from './components/game/GameIntro';
import { Dashboard } from './components/game/Dashboard';
import { OutcomeScreen } from './components/game/OutcomeScreen';
import { GameEnd } from './components/game/GameEnd';
import { getRandomDecisions } from './data/decisions';
import { calculateOutcome } from './utils/outcomeCalculator';

function App() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const {
    phase,
    currentQuarter,
    maxQuarters,
    players,
    submittedDecisions,
    currentDecisions,
    setPhase,
    setCurrentQuarter,
    setCurrentDecisions,
    setMarket,
    setOutcomes,
    updatePlayerMetrics,
  } = useGameStore();

  // Start quarter when all decisions submitted
  useEffect(() => {
    if (phase === 'decision' && submittedDecisions.size === players.length && players.length > 0) {
      // Move to resolution phase
      setPhase('resolution');

      // Calculate outcomes
      const outcomes = players.map(player => {
        const decisionOptionId = submittedDecisions.get(player.id);
        const decision = currentDecisions[0];
        const selectedOption = decision?.options.find(opt => opt.id === decisionOptionId);

        if (selectedOption) {
          return calculateOutcome(player, selectedOption, currentQuarter);
        }
        return null;
      }).filter(Boolean);

      setOutcomes(outcomes as any);

      // Show outcomes for 5 seconds
      setTimeout(() => {
        // Apply outcomes to players
        outcomes.forEach((outcome: any) => {
          if (outcome) {
            updatePlayerMetrics(outcome.playerId, outcome.metricChanges);
          }
        });

        // Clear submitted decisions
        submittedDecisions.clear();

        // Advance quarter
        const nextQuarter = currentQuarter + 1;
        setCurrentQuarter(nextQuarter);

        // Check if game ended
        if (nextQuarter >= maxQuarters) {
          setPhase('ended');
        } else {
          setPhase('information');
        }
      }, 5000);
    }
  }, [phase, submittedDecisions.size, players.length, currentDecisions]);

  // Game loop - simulate quarter progression
  useEffect(() => {
    if (phase === 'information' && playerId) {
      // Show information phase for 3 seconds, then move to decision
      const timer = setTimeout(() => {
        // Generate decisions for this quarter
        const decisions = getRandomDecisions(1, currentQuarter);
        setCurrentDecisions(decisions);
        setPhase('decision');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [phase, currentQuarter, playerId, setPhase, setCurrentDecisions]);

  // Simulate market evolution
  useEffect(() => {
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
  }, [currentQuarter, setMarket]);

  const handleGameStart = (newPlayerId: string) => {
    setPlayerId(newPlayerId);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Start the game at quarter 1
    setCurrentQuarter(1);
    setPhase('information');
  };

  if (!playerId) {
    return <GameSetup onStart={handleGameStart} />;
  }

  if (showIntro) {
    return <GameIntro onComplete={handleIntroComplete} />;
  }

  if (phase === 'ended') {
    return <GameEnd playerId={playerId} />;
  }

  if (phase === 'resolution') {
    return <OutcomeScreen />;
  }

  return <Dashboard playerId={playerId} />;
}

export default App;
