import { Achievement } from '@/types/game';

export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlockedAt'>> = {
  'theranos-avoided': {
    id: 'theranos-avoided',
    name: 'Theranos Avoided',
    description: 'Built a balanced board with both high-profile endorsers AND deep experts',
    icon: '🎯',
    category: 'learning',
  },
  'monkey-trainer': {
    id: 'monkey-trainer',
    name: 'Monkey Trainer',
    description: 'Successfully focused on the hardest problem first before building the pedestal',
    icon: '🐵',
    category: 'learning',
  },
  'bubble-survivor': {
    id: 'bubble-survivor',
    name: 'Bubble Survivor',
    description: 'Launched after a bubble burst and still succeeded',
    icon: '💪',
    category: 'learning',
  },
  'perfect-timing': {
    id: 'perfect-timing',
    name: 'Perfect Timing',
    description: 'Launched when all 5 bubble gauges were GREEN',
    icon: '⏰',
    category: 'learning',
  },
  'political-master': {
    id: 'political-master',
    name: 'Political Master',
    description: 'Successfully neutralized 3+ organizational resistors',
    icon: '🤝',
    category: 'learning',
  },
  'scenario-planner': {
    id: 'scenario-planner',
    name: 'Scenario Planner',
    description: 'Successfully predicted and prepared for an external shift',
    icon: '🔮',
    category: 'learning',
  },
  'when-master': {
    id: 'when-master',
    name: 'WHEN Master',
    description: 'Made 5+ optimal timing decisions',
    icon: '📅',
    category: 'mastery',
  },
  'why-master': {
    id: 'why-master',
    name: 'WHY Master',
    description: 'All promotion attempts succeeded',
    icon: '📢',
    category: 'mastery',
  },
  'who-master': {
    id: 'who-master',
    name: 'WHO Master',
    description: 'Built the perfect advisory structure',
    icon: '👥',
    category: 'mastery',
  },
  'what-master': {
    id: 'what-master',
    name: 'WHAT Master',
    description: 'Always prioritized hard problems appropriately',
    icon: '✓',
    category: 'mastery',
  },
  'how-master': {
    id: 'how-master',
    name: 'HOW Master',
    description: 'No organizational conflicts escalated',
    icon: '♟️',
    category: 'mastery',
  },
  'innovation-champion': {
    id: 'innovation-champion',
    name: 'Innovation Champion',
    description: 'Won the game with the highest Innovation Success Score',
    icon: '🏆',
    category: 'special',
  },
  'comeback-kid': {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Went from last place to first place',
    icon: '🚀',
    category: 'special',
  },
  'risk-manager': {
    id: 'risk-manager',
    name: 'Risk Manager',
    description: 'Completed the game with minimal technical debt',
    icon: '🛡️',
    category: 'special',
  },
  'reality-check': {
    id: 'reality-check',
    name: 'Reality Check',
    description: 'Kept stakeholder confidence within 20 points of actual progress throughout',
    icon: '⚖️',
    category: 'special',
  },
};

export function createAchievement(achievementId: string): Achievement {
  const base = ACHIEVEMENTS[achievementId];
  if (!base) {
    throw new Error(`Achievement ${achievementId} not found`);
  }
  return {
    ...base,
    unlockedAt: Date.now(),
  };
}
