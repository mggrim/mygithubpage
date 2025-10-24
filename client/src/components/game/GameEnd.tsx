import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Award, TrendingUp } from 'lucide-react';

interface GameEndProps {
  playerId: string;
}

export function GameEnd({ playerId }: GameEndProps) {
  const { players } = useGameStore();
  const player = players.find((p) => p.id === playerId);

  if (!player) return null;

  const calculateScore = (p: typeof player) => {
    const m = p.metrics;
    const launchSuccess = m.progress * 0.4;
    const organizationalSupport = m.stakeholderConfidence * 0.25;
    const resourceEfficiency = Math.max(0, 100 - Math.abs(m.budget / 1000)) * 0.2;
    const longTermViability = m.longTermViability * 0.15;
    return Math.round(launchSuccess + organizationalSupport + resourceEfficiency + longTermViability);
  };

  const finalScore = calculateScore(player);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Innovation Champion', color: 'text-yellow-600' };
    if (score >= 80) return { grade: 'A', label: 'Excellent Manager', color: 'text-green-600' };
    if (score >= 70) return { grade: 'B', label: 'Solid Execution', color: 'text-blue-600' };
    if (score >= 60) return { grade: 'C', label: 'Mixed Results', color: 'text-orange-600' };
    return { grade: 'D', label: 'Needs Improvement', color: 'text-red-600' };
  };

  const result = getGrade(finalScore);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
          <CardTitle className="text-4xl mb-2">Game Complete!</CardTitle>
          <p className="text-xl text-muted-foreground">
            Your 3-year innovation journey has concluded
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Final Score */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg">
              <div className="text-6xl font-bold mb-2">{finalScore}</div>
              <div className="text-2xl font-semibold mb-1">Innovation Success Score</div>
              <div className={`text-3xl font-bold ${result.color}`}>{result.grade}</div>
              <div className="text-xl text-muted-foreground mt-2">{result.label}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Score Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Launch Success (40%)</div>
                <div className="text-2xl font-bold">{Math.round(player.metrics.progress * 0.4)}</div>
                <div className="text-sm">Progress: {player.metrics.progress}%</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Organizational Support (25%)</div>
                <div className="text-2xl font-bold">
                  {Math.round(player.metrics.stakeholderConfidence * 0.25)}
                </div>
                <div className="text-sm">Confidence: {player.metrics.stakeholderConfidence}%</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Resource Efficiency (20%)</div>
                <div className="text-2xl font-bold">
                  {Math.round(Math.max(0, 100 - Math.abs(player.metrics.budget / 1000)) * 0.2)}
                </div>
                <div className="text-sm">Budget: ${Math.round(player.metrics.budget / 1000)}K</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Long-term Viability (15%)</div>
                <div className="text-2xl font-bold">
                  {Math.round(player.metrics.longTermViability * 0.15)}
                </div>
                <div className="text-sm">Viability: {player.metrics.longTermViability}%</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {player.achievements.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Achievements Earned ({player.achievements.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {player.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-purple-50 border-2 border-purple-200 p-3 rounded-lg flex items-center gap-3"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Metrics */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Final Metrics</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded">
                <div className="text-muted-foreground">Team Morale</div>
                <div className="text-xl font-bold">{player.metrics.teamMorale}%</div>
              </div>
              <div className="text-center p-3 bg-muted rounded">
                <div className="text-muted-foreground">Risk Score</div>
                <div className="text-xl font-bold">{player.metrics.riskScore}</div>
              </div>
              <div className="text-center p-3 bg-muted rounded">
                <div className="text-muted-foreground">Technical Debt</div>
                <div className="text-xl font-bold">{player.metrics.technicalDebt || 0}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-6">
            <Button size="lg" onClick={() => window.location.reload()}>
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
