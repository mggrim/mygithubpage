// Core game types for Innovation Runway

export type GamePhase = 'setup' | 'information' | 'decision' | 'resolution' | 'ended';

export type DecisionDimension = 'WHEN' | 'WHY' | 'WHO' | 'WHAT' | 'HOW';

export type HypeCycleStage =
  | 'Emerging'
  | 'Climbing'
  | 'Peak Hype'
  | 'Trough of Disillusionment'
  | 'Plateau of Productivity';

export type GaugeStatus = 'GREEN' | 'AMBER' | 'RED';

export type OrganizationType = 'Startup' | 'Mid-size Corp' | 'Enterprise' | 'Government';

export type InnovationDomain = 'AI/ML' | 'CleanTech' | 'BioTech' | 'FinTech' | 'EdTech';

export interface PlayerTrait {
  id: string;
  name: string;
  description: string;
  effects: {
    technicalProgress?: number;
    stakeholderConfidence?: number;
    budget?: number;
    teamMorale?: number;
    speed?: number;
  };
}

export interface PlayerMetrics {
  budget: number;
  progress: number; // 0-100
  stakeholderConfidence: number; // 0-100
  teamMorale: number; // 0-100
  runway: number; // quarters remaining
  riskScore: number; // 0-100
  longTermViability: number; // 0-100
  technicalDebt: number; // 0-100 (hidden metric)
}

export interface Player {
  id: string;
  name: string;
  color: string;
  organizationType: OrganizationType;
  innovationDomain: InnovationDomain;
  traits: PlayerTrait[];
  metrics: PlayerMetrics;
  decisions: DecisionRecord[];
  achievements: Achievement[];
  isAI: boolean;
  isHost: boolean;
}

export interface BubbleGauges {
  economicStrain: GaugeStatus;
  industryStrain: GaugeStatus;
  revenueGrowth: GaugeStatus;
  valuationHeat: GaugeStatus;
  fundingQuality: GaugeStatus;
}

export interface MarketState {
  hypeCycleStage: HypeCycleStage;
  hypeCyclePosition: number; // 0-100 position on curve
  bubbleGauges: BubbleGauges;
  bubbleRiskScore: GaugeStatus;
  competitorActivity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GameEvent {
  id: string;
  type: 'market' | 'internal' | 'technical' | 'media';
  title: string;
  description: string;
  affectsAllPlayers: boolean;
  affectedPlayerIds?: string[];
  requiresResponse: boolean;
  responses?: EventResponse[];
}

export interface EventResponse {
  id: string;
  label: string;
  description: string;
  effects: Partial<PlayerMetrics>;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  effects: Partial<PlayerMetrics> & {
    competitivePosition?: number;
    productQuality?: number;
    externalCredibility?: number;
    technicalValidation?: number;
    organizationalHarmony?: number;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Decision {
  id: string;
  dimension: DecisionDimension;
  quarter: number;
  title: string;
  context: {
    text: string;
    hypeCycle?: HypeCycleStage;
    bubbleGauges?: BubbleGauges;
    competitorActivity?: 'LOW' | 'MEDIUM' | 'HIGH';
    additionalInfo?: Record<string, any>;
  };
  options: DecisionOption[];
  learningPoints: string[];
  conceptLinks: {
    slide?: number;
    concept: string;
  }[];
  imageUrl?: string;
}

export interface DecisionRecord {
  decisionId: string;
  optionId: string;
  quarter: number;
  timestamp: number;
}

export interface Outcome {
  playerId: string;
  metricChanges: Partial<PlayerMetrics>;
  narrative: string;
  achievements: Achievement[];
  warnings?: string[];
  visualEffects?: {
    type: 'success' | 'warning' | 'danger' | 'info';
    animation?: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
  category: 'learning' | 'mastery' | 'special';
}

export interface GameState {
  gameId: string;
  phase: GamePhase;
  currentQuarter: number;
  maxQuarters: number;
  players: Player[];
  market: MarketState;
  currentEvent: GameEvent | null;
  currentDecisions: Decision[];
  submittedDecisions: Map<string, string>; // playerId -> optionId
  lastOutcomes: Outcome[];
  startedAt?: number;
  endedAt?: number;
  winnerId?: string;
}

export interface GameConfig {
  maxPlayers: number;
  minPlayers: number;
  maxQuarters: number;
  decisionTimeLimit: number; // seconds
  mode: 'quick' | 'strategic';
  aiOpponents: number;
}

// Store types for Zustand
export interface GameStore extends GameState {
  // Actions
  setGameId: (gameId: string) => void;
  setPhase: (phase: GamePhase) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  updatePlayerMetrics: (playerId: string, metrics: Partial<PlayerMetrics>) => void;
  setCurrentQuarter: (quarter: number) => void;
  setMarket: (market: Partial<MarketState>) => void;
  setCurrentEvent: (event: GameEvent | null) => void;
  setCurrentDecisions: (decisions: Decision[]) => void;
  submitDecision: (playerId: string, optionId: string) => void;
  setOutcomes: (outcomes: Outcome[]) => void;
  addAchievement: (playerId: string, achievement: Achievement) => void;
  resetGame: () => void;
}
