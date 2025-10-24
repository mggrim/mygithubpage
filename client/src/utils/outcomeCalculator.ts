import { Player, DecisionOption, Outcome, PlayerMetrics } from '@/types/game';
import { createAchievement } from '@/data/achievements';

/**
 * Calculate the outcome of a decision with hidden factors and contextual modifiers
 * This is where the "behind the scenes" magic happens
 */
export function calculateOutcome(
  player: Player,
  option: DecisionOption,
  currentQuarter: number
): Outcome {
  const baseEffects = { ...option.effects };
  const hiddenFactors: Partial<PlayerMetrics> = {};
  const achievements: any[] = [];
  const warnings: string[] = [];
  let narrative = generateNarrative(player, option, currentQuarter);

  // Apply player trait modifiers (hidden from obvious view)
  player.traits.forEach(trait => {
    if (trait.effects.technicalProgress && baseEffects.progress) {
      baseEffects.progress = Math.round(baseEffects.progress * (1 + trait.effects.technicalProgress / 100));
    }
    if (trait.effects.stakeholderConfidence && baseEffects.stakeholderConfidence) {
      baseEffects.stakeholderConfidence = Math.round(
        baseEffects.stakeholderConfidence * (1 + trait.effects.stakeholderConfidence / 100)
      );
    }
    if (trait.effects.budget && baseEffects.budget) {
      baseEffects.budget = Math.round(baseEffects.budget * (1 + trait.effects.budget / 100));
    }
  });

  // Context-based modifiers (time in game affects outcomes)
  const earlyGame = currentQuarter <= 4;
  const lateGame = currentQuarter > 8;

  // Hidden factor: Technical Debt accumulation
  if (option.riskLevel === 'HIGH' && option.effects.progress && option.effects.progress < 0) {
    hiddenFactors.technicalDebt = (player.metrics.technicalDebt || 0) + 15;
    narrative += ' The shortcuts you\'ve taken are starting to accumulate...';
  } else if (baseEffects.progress && baseEffects.progress > 15) {
    hiddenFactors.technicalDebt = Math.max(0, (player.metrics.technicalDebt || 0) - 5);
  }

  // Hidden factor: Momentum (success breeds success, failure compounds)
  if (player.metrics.progress > 70 && baseEffects.progress && baseEffects.progress > 0) {
    baseEffects.progress = Math.round(baseEffects.progress * 1.2);
    narrative += ' Your strong momentum is accelerating progress!';
  } else if (player.metrics.progress < 30 && baseEffects.progress && baseEffects.progress < 0) {
    baseEffects.progress = Math.round(baseEffects.progress * 1.3);
    warnings.push('Low progress is creating a downward spiral. Consider refocusing efforts.');
  }

  // Hidden factor: Theranos warning system
  const confidenceGap = player.metrics.stakeholderConfidence - player.metrics.progress;
  if (confidenceGap > 30) {
    warnings.push(
      '⚠️ THERANOS ALERT: Your stakeholder confidence far exceeds actual progress. This is extremely risky!'
    );
    // Increased risk of credibility crash
    if (confidenceGap > 50 && Math.random() < 0.3) {
      baseEffects.stakeholderConfidence = -40;
      baseEffects.teamMorale = -20;
      narrative =
        'CREDIBILITY CRISIS! Stakeholders have discovered that progress doesn\'t match your promises. Trust has been severely damaged.';
      warnings.push('You have experienced a Theranos-style credibility crash.');
    }
  } else if (confidenceGap < -20 && confidenceGap > -35) {
    // Good balance - slight bonus
    baseEffects.stakeholderConfidence = (baseEffects.stakeholderConfidence || 0) + 5;
    narrative += ' Your realistic expectations are building genuine trust.';

    // Check for Reality Check achievement
    if (!player.achievements.find(a => a.id === 'reality-check')) {
      achievements.push(createAchievement('reality-check'));
    }
  }

  // Hidden factor: Team morale affects productivity
  const moraleMultiplier = player.metrics.teamMorale / 60; // 60 is baseline
  if (baseEffects.progress) {
    baseEffects.progress = Math.round(baseEffects.progress * moraleMultiplier);
  }

  // Context: Early decisions have lasting impact
  if (earlyGame && option.effects.longTermViability) {
    const modifier = option.effects.longTermViability > 0 ? 1.5 : 1.3;
    baseEffects.longTermViability = Math.round((baseEffects.longTermViability || 0) * modifier);
    narrative += ' Early strategic choices will shape your entire journey.';
  }

  // Context: Late game is less forgiving
  if (lateGame && option.riskLevel === 'HIGH') {
    if (baseEffects.stakeholderConfidence && baseEffects.stakeholderConfidence < 0) {
      baseEffects.stakeholderConfidence = Math.round(baseEffects.stakeholderConfidence * 1.5);
      warnings.push('Late-game risks have amplified negative consequences.');
    }
  }

  // Hidden factor: Budget pressure
  if (player.metrics.budget < 100000) {
    warnings.push('⚠️ Budget is critically low. You may need to make difficult trade-offs.');
    hiddenFactors.teamMorale = -5; // Low budget hurts morale
  }

  // Hidden factor: Runway pressure
  if (player.metrics.runway <= 3) {
    warnings.push('⚠️ Only 3 quarters of runway remaining! Time is running out.');
    hiddenFactors.riskScore = (player.metrics.riskScore || 0) + 10;
  }

  // Achievement checks
  if (baseEffects.progress && baseEffects.progress > 20 && option.label?.includes('Monkey')) {
    if (!player.achievements.find(a => a.id === 'monkey-trainer')) {
      achievements.push(createAchievement('monkey-trainer'));
      narrative += ' Achievement Unlocked: Monkey Trainer! You prioritized the hard problem first.';
    }
  }

  // Combine all effects
  const finalEffects: Partial<PlayerMetrics> = {
    ...baseEffects,
    ...hiddenFactors,
  };

  // Apply constraints (metrics can't go below 0 or above 100 for percentages)
  Object.keys(finalEffects).forEach(key => {
    const metricKey = key as keyof PlayerMetrics;
    const currentValue = player.metrics[metricKey] as number;
    const change = finalEffects[metricKey] as number;

    if (['progress', 'stakeholderConfidence', 'teamMorale', 'longTermViability'].includes(key)) {
      const newValue = currentValue + change;
      if (newValue > 100) {
        finalEffects[metricKey] = 100 - currentValue;
      } else if (newValue < 0) {
        finalEffects[metricKey] = -currentValue;
      }
    }
  });

  return {
    playerId: player.id,
    metricChanges: finalEffects,
    narrative,
    achievements,
    warnings,
  };
}

function generateNarrative(_player: Player, option: DecisionOption, quarter: number): string {
  const narratives = {
    HIGH_RISK_SUCCESS: [
      'Your bold gamble paid off! The aggressive approach created breakthrough momentum.',
      'Risk-taking has its rewards - stakeholders are impressed by your decisive action.',
      'The high-stakes decision worked out, though not without some collateral damage.',
    ],
    HIGH_RISK_FAILURE: [
      'The aggressive approach backfired. Stakeholders are questioning your judgment.',
      'Your risky decision has created complications that will take time to resolve.',
      'The bold move didn\'t pan out as expected - damage control is now required.',
    ],
    LOW_RISK_SUCCESS: [
      'Your conservative approach is building a solid foundation for long-term success.',
      'Steady progress wins the race - your measured strategy is paying dividends.',
      'The careful, deliberate approach has strengthened your position.',
    ],
    BALANCED: [
      'Your balanced decision has created mixed results - some gains, some trade-offs.',
      'A pragmatic choice that moves you forward while managing risks.',
      'Your measured approach is maintaining steady progress.',
    ],
  };

  // Determine outcome type based on risk level and effects
  let outcomeType: keyof typeof narratives = 'BALANCED';

  if (option.riskLevel === 'HIGH') {
    const hasPositiveEffect = Object.values(option.effects).some(v => (v as number) > 15);
    outcomeType = hasPositiveEffect ? 'HIGH_RISK_SUCCESS' : 'HIGH_RISK_FAILURE';
  } else if (option.riskLevel === 'LOW') {
    outcomeType = 'LOW_RISK_SUCCESS';
  }

  const narrativeSet = narratives[outcomeType];
  const baseNarrative = narrativeSet[Math.floor(Math.random() * narrativeSet.length)];

  // Add quarter-specific context
  if (quarter <= 3) {
    return `Early days: ${baseNarrative}`;
  } else if (quarter >= 10) {
    return `Endgame: ${baseNarrative} Time is running short.`;
  }

  return baseNarrative;
}
