import { useState } from 'react';
import { Decision } from '@/types/game';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface DecisionModalProps {
  decision: Decision;
  onSubmit: (optionId: string) => void;
  timeRemaining?: number;
}

export function DecisionModal({ decision, onSubmit, timeRemaining }: DecisionModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'WHEN':
        return 'bg-blue-500';
      case 'WHY':
        return 'bg-green-500';
      case 'WHO':
        return 'bg-purple-500';
      case 'WHAT':
        return 'bg-yellow-500';
      case 'HOW':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'text-success bg-success/10';
      case 'MEDIUM':
        return 'text-warning bg-warning/10';
      case 'HIGH':
        return 'text-danger bg-danger/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const renderEffects = (effects: any) => {
    return Object.entries(effects)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const numValue = value as number;
        const isPositive = numValue > 0;
        const displayValue = Math.abs(numValue);

        return (
          <div
            key={key}
            className={`flex items-center gap-2 text-xs ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())
                .trim()}
              : {isPositive ? '+' : '-'}
              {displayValue}
            </span>
          </div>
        );
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg max-w-4xl w-full my-8 slide-in-up">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getDimensionColor(decision.dimension)}`}>
                {decision.dimension}
              </div>
              <h2 className="text-2xl font-bold">{decision.title}</h2>
            </div>
            {timeRemaining !== undefined && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeRemaining < 30
                    ? 'bg-danger/10 text-danger'
                    : timeRemaining < 60
                    ? 'bg-warning/10 text-warning'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Context */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">{decision.context.text}</p>
            {decision.context.hypeCycle && (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Hype Cycle: {decision.context.hypeCycle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {decision.options.map((option) => (
            <Card
              key={option.id}
              className={`decision-card cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-primary border-2 shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {option.id}
                      </span>
                      <CardTitle className="text-lg">{option.label}</CardTitle>
                      {selectedOption === option.id && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(option.riskLevel)}`}>
                    {option.riskLevel} RISK
                  </div>
                </div>
              </CardHeader>

              {(showDetails === option.id || selectedOption === option.id) && (
                <CardContent className="pt-0 space-y-4">
                  {/* Pros */}
                  <div>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      Pros
                    </div>
                    <ul className="space-y-1">
                      {option.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-1">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-danger">
                      <AlertCircle className="w-4 h-4" />
                      Cons
                    </div>
                    <ul className="space-y-1">
                      {option.cons.map((con, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-danger mt-1">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Effects */}
                  <div>
                    <div className="text-sm font-semibold mb-2">Expected Effects</div>
                    <div className="grid grid-cols-2 gap-2">{renderEffects(option.effects)}</div>
                  </div>
                </CardContent>
              )}

              {showDetails !== option.id && selectedOption !== option.id && (
                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(option.id);
                    }}
                  >
                    Show Details
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Learning Points */}
        {decision.learningPoints.length > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-900">
                <Info className="w-4 h-4" />
                Key Learning Points
              </div>
              <ul className="space-y-1">
                {decision.learningPoints.map((point, index) => (
                  <li key={index} className="text-xs text-blue-800">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="p-6 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedOption
              ? 'Click Submit to lock in your decision'
              : 'Select an option above to continue'}
          </div>
          <Button
            size="lg"
            onClick={() => selectedOption && onSubmit(selectedOption)}
            disabled={!selectedOption}
            className="min-w-[150px]"
          >
            Submit Decision
          </Button>
        </div>
      </div>
    </div>
  );
}
