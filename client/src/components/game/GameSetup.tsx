import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, OrganizationType, InnovationDomain, PlayerMetrics } from '@/types/game';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRandomTraits } from '@/data/playerTraits';
import { Plane } from 'lucide-react';

interface GameSetupProps {
  onStart: (playerId: string) => void;
}

const PLAYER_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const ORGANIZATION_TYPES: OrganizationType[] = ['Startup', 'Mid-size Corp', 'Enterprise', 'Government'];
const INNOVATION_DOMAINS: InnovationDomain[] = ['AI/ML', 'CleanTech', 'BioTech', 'FinTech', 'EdTech'];

export function GameSetup({ onStart }: GameSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<OrganizationType>('Startup');
  const [selectedDomain, setSelectedDomain] = useState<InnovationDomain>('AI/ML');
  const { addPlayer, setPhase, setGameId } = useGameStore();

  const getInitialMetrics = (orgType: OrganizationType): PlayerMetrics => {
    const baseMetrics = {
      Startup: { budget: 500000, runway: 8 },
      'Mid-size Corp': { budget: 2000000, runway: 12 },
      Enterprise: { budget: 5000000, runway: 16 },
      Government: { budget: 3000000, runway: 20 },
    };

    const { budget, runway } = baseMetrics[orgType];

    return {
      budget,
      progress: 0,
      stakeholderConfidence: 50,
      teamMorale: 60,
      runway,
      riskScore: 30,
      longTermViability: 50,
      technicalDebt: 0,
    };
  };

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const playerId = `player-${Date.now()}`;
    const player: Player = {
      id: playerId,
      name: playerName,
      color: PLAYER_COLORS[0],
      organizationType: selectedOrg,
      innovationDomain: selectedDomain,
      traits: getRandomTraits(2),
      metrics: getInitialMetrics(selectedOrg),
      decisions: [],
      achievements: [],
      isAI: false,
      isHost: true,
    };

    // Generate game ID
    const gameId = `game-${Date.now()}`;
    setGameId(gameId);

    // Add player
    addPlayer(player);

    // Start game
    setPhase('information');

    // Notify parent
    onStart(playerId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Innovation Runway</h1>
          </div>
          <CardTitle>Setup Your Innovation</CardTitle>
          <CardDescription>
            Configure your player profile to begin your journey as an innovation manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Organization Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Organization Type</label>
            <div className="grid grid-cols-2 gap-3">
              {ORGANIZATION_TYPES.map((org) => (
                <button
                  key={org}
                  onClick={() => setSelectedOrg(org)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedOrg === org
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">{org}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {org === 'Startup' && 'Budget: $500K • Runway: 8Q'}
                    {org === 'Mid-size Corp' && 'Budget: $2M • Runway: 12Q'}
                    {org === 'Enterprise' && 'Budget: $5M • Runway: 16Q'}
                    {org === 'Government' && 'Budget: $3M • Runway: 20Q'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Innovation Domain */}
          <div>
            <label className="block text-sm font-medium mb-2">Innovation Domain</label>
            <div className="grid grid-cols-3 gap-3">
              {INNOVATION_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    selectedDomain === domain
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold text-sm">{domain}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">About the Game</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You'll manage an innovation project over 12 quarters, making critical decisions across five
              dimensions: <strong>WHEN</strong> (timing), <strong>WHY</strong> (promoting),{' '}
              <strong>WHO</strong> (social proofing), <strong>WHAT</strong> (progress), and{' '}
              <strong>HOW</strong> (strategy). Balance stakeholder expectations with technical reality, avoid
              the Theranos trap, and successfully launch your innovation!
            </p>
          </div>

          {/* Start Button */}
          <Button size="lg" onClick={handleStartGame} className="w-full">
            Start Your Innovation Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
