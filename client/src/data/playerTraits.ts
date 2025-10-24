import { PlayerTrait } from '@/types/game';

export const PLAYER_TRAITS: PlayerTrait[] = [
  {
    id: 'technical-visionary',
    name: 'Technical Visionary',
    description: 'Deep technical expertise but struggles with executive communication',
    effects: {
      technicalProgress: 10,
      stakeholderConfidence: -10,
    },
  },
  {
    id: 'political-navigator',
    name: 'Political Navigator',
    description: 'Excellent at managing stakeholders but slower on technical execution',
    effects: {
      stakeholderConfidence: 15,
      technicalProgress: -5,
    },
  },
  {
    id: 'resource-optimizer',
    name: 'Resource Optimizer',
    description: 'Highly efficient with budget but takes longer to deliver',
    effects: {
      budget: 20,
      speed: -10,
    },
  },
  {
    id: 'team-builder',
    name: 'Team Builder',
    description: 'Inspires teams and maintains high morale',
    effects: {
      teamMorale: 15,
      technicalProgress: 5,
    },
  },
  {
    id: 'risk-taker',
    name: 'Risk Taker',
    description: 'Moves fast and breaks things, high reward but high risk',
    effects: {
      speed: 20,
      stakeholderConfidence: -5,
    },
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Delivers exceptional quality but burns budget and time',
    effects: {
      technicalProgress: 15,
      budget: -10,
      speed: -10,
    },
  },
  {
    id: 'storyteller',
    name: 'Master Storyteller',
    description: 'Excellent at promoting innovations and building excitement',
    effects: {
      stakeholderConfidence: 20,
    },
  },
  {
    id: 'data-driven',
    name: 'Data-Driven Analyst',
    description: 'Makes evidence-based decisions, reduces risk',
    effects: {
      technicalProgress: 10,
    },
  },
];

export function getRandomTraits(count: number = 2): PlayerTrait[] {
  const shuffled = [...PLAYER_TRAITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
