import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, TrendingUp, Users, Award } from 'lucide-react';

interface GameIntroProps {
  onComplete: () => void;
}

export function GameIntro({ onComplete }: GameIntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Welcome to Innovation Runway</h1>
            <p className="text-xl text-muted-foreground">
              A Strategic Simulation of Innovation Management
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Your Mission
            </h2>
            <p className="text-lg leading-relaxed">
              You are an innovation manager tasked with successfully launching a groundbreaking
              technology product. Over the next <strong>12 quarters (3 years)</strong>, you must navigate:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Market Timing:</strong> Launch at the right moment in the hype cycle
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Stakeholder Management:</strong> Balance expectations with reality
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Technical Excellence:</strong> Solve hard problems before building the pedestal
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Organizational Politics:</strong> Navigate supporters, resistors, and saboteurs
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold">How to Win</h2>
            <p className="leading-relaxed">
              Your <strong>Innovation Success Score</strong> is calculated from:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">40%</div>
                <div className="text-sm text-blue-700">Launch Success</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">25%</div>
                <div className="text-sm text-green-700">Organizational Support</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">20%</div>
                <div className="text-sm text-purple-700">Resource Efficiency</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-900">15%</div>
                <div className="text-sm text-yellow-700">Long-term Viability</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-red-600">⚠️ Beware the Theranos Trap</h2>
            <p className="leading-relaxed">
              If your stakeholder confidence significantly exceeds your actual progress, you risk a
              catastrophic credibility crisis. Build real progress before promoting success!
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Key Strategic Insights</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Not all information is visible - watch for patterns and signals</li>
              <li>✓ Your decisions create path dependencies - early choices matter</li>
              <li>✓ Market conditions evolve - what works in Quarter 1 may fail in Quarter 10</li>
              <li>✓ Hidden factors like technical debt compound over time</li>
              <li>✓ There are multiple paths to success - no single "correct" strategy</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onComplete} className="px-12 py-6 text-lg">
              Begin Your Innovation Journey →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
