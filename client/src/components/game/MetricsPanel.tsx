import { Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercent, getMetricColor, getMetricBgColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Zap, Clock, AlertTriangle } from 'lucide-react';

interface MetricsPanelProps {
  player: Player;
}

export function MetricsPanel({ player }: MetricsPanelProps) {
  const { metrics } = player;

  const getMetricTrend = (value: number) => {
    if (value >= 70) return <TrendingUp className="w-4 h-4 text-success" />;
    if (value >= 40) return <Minus className="w-4 h-4 text-warning" />;
    return <TrendingDown className="w-4 h-4 text-danger" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Budget</span>
              </div>
              <span className="text-sm font-bold">{formatCurrency(metrics.budget)}</span>
            </div>
          </div>

          {/* Innovation Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Progress</span>
                {getMetricTrend(metrics.progress)}
              </div>
              <span className={`text-sm font-bold ${getMetricColor(metrics.progress)}`}>
                {formatPercent(metrics.progress)}
              </span>
            </div>
            <Progress
              value={metrics.progress}
              max={100}
              indicatorClassName={getMetricBgColor(metrics.progress)}
            />
          </div>

          {/* Stakeholder Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Stakeholder Confidence</span>
                {getMetricTrend(metrics.stakeholderConfidence)}
              </div>
              <span className={`text-sm font-bold ${getMetricColor(metrics.stakeholderConfidence)}`}>
                {formatPercent(metrics.stakeholderConfidence)}
              </span>
            </div>
            <Progress
              value={metrics.stakeholderConfidence}
              max={100}
              indicatorClassName={getMetricBgColor(metrics.stakeholderConfidence)}
            />
            {/* Theranos Warning */}
            {Math.abs(metrics.stakeholderConfidence - metrics.progress) > 30 && (
              <div className="flex items-center gap-2 text-xs text-danger bg-danger/10 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                <span>Warning: Confidence exceeds progress (Theranos risk!)</span>
              </div>
            )}
          </div>

          {/* Team Morale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Team Morale</span>
                {getMetricTrend(metrics.teamMorale)}
              </div>
              <span className={`text-sm font-bold ${getMetricColor(metrics.teamMorale)}`}>
                {formatPercent(metrics.teamMorale)}
              </span>
            </div>
            <Progress
              value={metrics.teamMorale}
              max={100}
              indicatorClassName={getMetricBgColor(metrics.teamMorale)}
            />
          </div>

          {/* Runway */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Runway</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  metrics.runway <= 3
                    ? 'text-danger'
                    : metrics.runway <= 6
                    ? 'text-warning'
                    : 'text-success'
                }`}
              >
                {metrics.runway} quarters
              </span>
            </div>
          </div>

          {/* Risk Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  metrics.riskScore >= 70
                    ? 'text-danger'
                    : metrics.riskScore >= 40
                    ? 'text-warning'
                    : 'text-success'
                }`}
              >
                {metrics.riskScore >= 70
                  ? 'HIGH'
                  : metrics.riskScore >= 40
                  ? 'MEDIUM'
                  : 'LOW'}
              </span>
            </div>
          </div>

          {/* Long-term Viability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Long-term Viability</span>
                {getMetricTrend(metrics.longTermViability)}
              </div>
              <span className={`text-sm font-bold ${getMetricColor(metrics.longTermViability)}`}>
                {formatPercent(metrics.longTermViability)}
              </span>
            </div>
            <Progress
              value={metrics.longTermViability}
              max={100}
              indicatorClassName={getMetricBgColor(metrics.longTermViability)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {player.achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {player.achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-badge bounce-in" title={achievement.description}>
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-xs">{achievement.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Innovation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Domain:</span>
            <span className="font-medium">{player.innovationDomain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organization:</span>
            <span className="font-medium">{player.organizationType}</span>
          </div>
          {player.traits.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-muted-foreground mb-2">Traits:</div>
              {player.traits.map((trait) => (
                <div key={trait.id} className="text-xs bg-blue-50 p-2 rounded mb-1" title={trait.description}>
                  <span className="font-medium">{trait.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
