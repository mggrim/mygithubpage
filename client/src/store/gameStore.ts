import { create } from 'zustand';
import { GameStore, GamePhase, Player, MarketState, GameEvent, Decision, Outcome, Achievement, PlayerMetrics } from '@/types/game';

const initialMarketState: MarketState = {
  hypeCycleStage: 'Emerging',
  hypeCyclePosition: 10,
  bubbleGauges: {
    economicStrain: 'GREEN',
    industryStrain: 'GREEN',
    revenueGrowth: 'GREEN',
    valuationHeat: 'GREEN',
    fundingQuality: 'GREEN',
  },
  bubbleRiskScore: 'GREEN',
  competitorActivity: 'LOW',
};

const initialState = {
  gameId: '',
  phase: 'setup' as GamePhase,
  currentQuarter: 0,
  maxQuarters: 12,
  players: [],
  market: initialMarketState,
  currentEvent: null,
  currentDecisions: [],
  submittedDecisions: new Map<string, string>(),
  lastOutcomes: [],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  // Actions
  setGameId: (gameId: string) => set({ gameId }),

  setPhase: (phase: GamePhase) => set({ phase }),

  addPlayer: (player: Player) =>
    set((state) => ({
      players: [...state.players, player]
    })),

  removePlayer: (playerId: string) =>
    set((state) => ({
      players: state.players.filter(p => p.id !== playerId),
    })),

  updatePlayer: (playerId: string, updates: Partial<Player>) =>
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId ? { ...p, ...updates } : p
      ),
    })),

  updatePlayerMetrics: (playerId: string, metrics: Partial<PlayerMetrics>) =>
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              metrics: {
                ...p.metrics,
                ...metrics,
              },
            }
          : p
      ),
    })),

  setCurrentQuarter: (quarter: number) => set({ currentQuarter: quarter }),

  setMarket: (market: Partial<MarketState>) =>
    set((state) => ({
      market: {
        ...state.market,
        ...market,
      },
    })),

  setCurrentEvent: (event: GameEvent | null) => set({ currentEvent: event }),

  setCurrentDecisions: (decisions: Decision[]) =>
    set({ currentDecisions: decisions }),

  submitDecision: (playerId: string, optionId: string) =>
    set((state) => {
      const newSubmittedDecisions = new Map(state.submittedDecisions);
      newSubmittedDecisions.set(playerId, optionId);
      return { submittedDecisions: newSubmittedDecisions };
    }),

  setOutcomes: (outcomes: Outcome[]) => set({ lastOutcomes: outcomes }),

  addAchievement: (playerId: string, achievement: Achievement) =>
    set((state) => ({
      players: state.players.map(p =>
        p.id === playerId
          ? {
              ...p,
              achievements: [...p.achievements, achievement],
            }
          : p
      ),
    })),

  resetGame: () => set(initialState),
}));

// Selector hooks for common queries
export const useCurrentPlayer = (playerId: string) => {
  return useGameStore((state) => state.players.find(p => p.id === playerId));
};

export const useLeaderboard = () => {
  return useGameStore((state) => {
    const players = [...state.players];
    // Calculate score for each player
    return players
      .map(p => ({
        ...p,
        score: calculatePlayerScore(p),
      }))
      .sort((a, b) => b.score - a.score);
  });
};

// Helper function to calculate player score
function calculatePlayerScore(player: Player): number {
  const m = player.metrics;

  // Innovation Success Score formula (from spec)
  const launchSuccess = m.progress * 0.4;
  const organizationalSupport = m.stakeholderConfidence * 0.25;
  const resourceEfficiency = (100 - Math.abs(m.budget / 10)) * 0.2; // Simplified
  const longTermViability = m.longTermViability * 0.15;

  return launchSuccess + organizationalSupport + resourceEfficiency + longTermViability;
}
