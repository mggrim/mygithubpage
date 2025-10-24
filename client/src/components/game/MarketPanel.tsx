import { MarketState, GaugeStatus } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface MarketPanelProps {
  market: MarketState;
}

export function MarketPanel({ market }: MarketPanelProps) {
  const getGaugeLabel = (status: GaugeStatus) => {
    return (
      <span
        className={`inline-flex items-center justify-center w-16 px-2 py-1 text-xs font-bold rounded ${
          status === 'GREEN'
            ? 'bg-success/20 text-success'
            : status === 'AMBER'
            ? 'bg-warning/20 text-warning'
            : 'bg-danger/20 text-danger'
        }`}
      >
        {status}
      </span>
    );
  };

  const hypeCycleStages = [
    'Emerging',
    'Climbing',
    'Peak Hype',
    'Trough of Disillusionment',
    'Plateau of Productivity',
  ];

  const currentStageIndex = hypeCycleStages.indexOf(market.hypeCycleStage);

  return (
    <div className="space-y-4">
      {/* Hype Cycle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Hype Cycle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">{market.hypeCycleStage}</div>
            <div className="text-sm text-muted-foreground mb-4">
              Position: {market.hypeCyclePosition}%
            </div>
          </div>

          {/* Visual Hype Cycle */}
          <div className="space-y-2">
            {hypeCycleStages.map((stage, index) => (
              <div
                key={stage}
                className={`flex items-center gap-2 p-2 rounded transition-all ${
                  index === currentStageIndex
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted/30'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === currentStageIndex ? 'bg-primary pulse-glow' : 'bg-muted'
                  }`}
                />
                <span
                  className={`text-sm ${
                    index === currentStageIndex ? 'font-bold text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bubble Gauges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Bubble Risk Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Economic Strain</span>
            {getGaugeLabel(market.bubbleGauges.economicStrain)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Industry Strain</span>
            {getGaugeLabel(market.bubbleGauges.industryStrain)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Revenue Growth</span>
            {getGaugeLabel(market.bubbleGauges.revenueGrowth)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Valuation Heat</span>
            {getGaugeLabel(market.bubbleGauges.valuationHeat)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Funding Quality</span>
            {getGaugeLabel(market.bubbleGauges.fundingQuality)}
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Overall Bubble Risk</span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full ${
                  market.bubbleRiskScore === 'GREEN'
                    ? 'bg-success text-white'
                    : market.bubbleRiskScore === 'AMBER'
                    ? 'bg-warning text-white'
                    : 'bg-danger text-white pulse-glow'
                }`}
              >
                {market.bubbleRiskScore === 'RED' && <AlertCircle className="w-4 h-4" />}
                {market.bubbleRiskScore}
              </span>
            </div>
          </div>

          {market.bubbleRiskScore === 'RED' && (
            <div className="flex items-start gap-2 text-xs bg-danger/10 text-danger p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-1">BUBBLE WARNING!</div>
                <div>
                  3+ indicators are RED. High risk of market correction. Consider defensive
                  strategies.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitor Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Market Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">Competitor Activity</span>
            <span
              className={`px-3 py-1 text-sm font-bold rounded-full ${
                market.competitorActivity === 'HIGH'
                  ? 'bg-danger text-white'
                  : market.competitorActivity === 'MEDIUM'
                  ? 'bg-warning text-white'
                  : 'bg-success text-white'
              }`}
            >
              {market.competitorActivity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {market.competitorActivity === 'HIGH' &&
              'Many competitors are rushing to market. First-mover advantage window is closing.'}
            {market.competitorActivity === 'MEDIUM' &&
              'Moderate competitive pressure. Strategic timing matters.'}
            {market.competitorActivity === 'LOW' &&
              'Few competitors active. Opportunity to establish market position.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
