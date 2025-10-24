import { useGameStore } from '@/store/gameStore';
import { MetricsPanel } from './MetricsPanel';
import { MarketPanel } from './MarketPanel';
import { Leaderboard } from './Leaderboard';
import { DecisionModal } from './DecisionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Clock } from 'lucide-react';

interface DashboardProps {
  playerId: string;
}

export function Dashboard({ playerId }: DashboardProps) {
  const {
    players,
    currentQuarter,
    maxQuarters,
    market,
    phase,
    currentDecisions,
    currentEvent,
    submitDecision,
  } = useGameStore();

  const currentPlayer = players.find((p) => p.id === playerId);

  if (!currentPlayer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Player not found</h2>
          <p className="text-muted-foreground">Unable to load player data</p>
        </div>
      </div>
    );
  }

  const handleDecisionSubmit = (optionId: string) => {
    submitDecision(playerId, optionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Plane className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">Innovation Runway</h1>
              </div>
              <div className={`game-phase-indicator phase-${phase}`}>
                {phase.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  Quarter {currentQuarter} / {maxQuarters}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Playing as:</span>{' '}
                <span className="font-bold" style={{ color: currentPlayer.color }}>
                  {currentPlayer.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Player Metrics */}
          <div className="col-span-12 lg:col-span-3">
            <MetricsPanel player={currentPlayer} />
          </div>

          {/* Center Panel - Main Display */}
          <div className="col-span-12 lg:col-span-6">
            {/* Airplane Visualization */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Innovation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg overflow-hidden">
                  {/* Runway */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400" />

                  {/* Airplane */}
                  <div
                    className="absolute bottom-4 transition-all duration-1000 ease-out"
                    style={{
                      left: `${currentPlayer.metrics.progress}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Plane
                      className="w-12 h-12 text-primary"
                      style={{
                        transform: `rotate(-${Math.min(currentPlayer.metrics.progress / 2, 45)}deg)`,
                      }}
                    />
                  </div>

                  {/* Finish Line */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-success" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground">Altitude</div>
                    <div className="font-bold">{currentPlayer.metrics.stakeholderConfidence}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Speed</div>
                    <div className="font-bold">{currentPlayer.metrics.teamMorale}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fuel</div>
                    <div className="font-bold">${currentPlayer.metrics.budget / 1000}K</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Display */}
            {currentEvent && (
              <Card className="mb-6 border-yellow-500 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Event: {currentEvent.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{currentEvent.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Phase-specific content */}
            {phase === 'information' && (
              <Card>
                <CardHeader>
                  <CardTitle>Information Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Review the market conditions and your current metrics. Decisions are coming next!
                  </p>
                </CardContent>
              </Card>
            )}

            {phase === 'resolution' && (
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Processing decisions and calculating outcomes...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Market & Leaderboard */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              <MarketPanel market={market} />
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {phase === 'decision' && currentDecisions.length > 0 && (
        <DecisionModal
          decision={currentDecisions[0]}
          onSubmit={handleDecisionSubmit}
          timeRemaining={180} // 3 minutes
        />
      )}
    </div>
  );
}
