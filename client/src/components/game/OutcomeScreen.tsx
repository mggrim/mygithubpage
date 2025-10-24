import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from 'lucide-react';

export function OutcomeScreen() {
  const { lastOutcomes } = useGameStore();

  if (lastOutcomes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold">Calculating Outcomes...</div>
        </div>
      </div>
    );
  }

  const outcome = lastOutcomes[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-3xl bounce-in">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl">Quarter Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Narrative */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
            <p className="text-lg leading-relaxed">{outcome.narrative}</p>
          </div>

          {/* Metric Changes */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Impact on Your Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(outcome.metricChanges).map(([key, value]) => {
                const numValue = value as number;
                if (numValue === 0) return null;

                const isPositive = numValue > 0;
                const displayKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-4 rounded-lg ${
                      isPositive ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">{displayKey}</div>
                      <div
                        className={`text-xl font-bold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {numValue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          {outcome.achievements && outcome.achievements.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Achievements Unlocked!
              </h3>
              <div className="space-y-2">
                {outcome.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg flex items-center gap-3 bounce-in"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <div className="font-bold text-yellow-900">{achievement.name}</div>
                      <div className="text-sm text-yellow-700">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {outcome.warnings && outcome.warnings.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Warnings
              </h3>
              <div className="space-y-2">
                {outcome.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                  >
                    <p className="text-red-800">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-muted-foreground text-sm pt-4">
            Proceeding to next quarter...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
