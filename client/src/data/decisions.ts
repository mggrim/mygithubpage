import { Decision } from '@/types/game';

// WHEN Decisions (Timing)
export const WHEN_DECISIONS: Decision[] = [
  {
    id: 'when_launch_timing_01',
    dimension: 'WHEN',
    quarter: 6,
    title: 'Launch Timing Decision',
    context: {
      text: 'Current hype is at PEAK. Industry Strain is AMBER (6x ratio), but Revenue Growth is strong (100% YoY). Competitors are rushing to market.',
      hypeCycle: 'Peak Hype',
      bubbleGauges: {
        economicStrain: 'GREEN',
        industryStrain: 'AMBER',
        revenueGrowth: 'GREEN',
        valuationHeat: 'AMBER',
        fundingQuality: 'GREEN',
      },
      competitorActivity: 'HIGH',
    },
    options: [
      {
        id: 'A',
        label: 'Launch NOW - Ride the hype wave',
        description: 'Capitalize on current market enthusiasm',
        pros: ['Maximum visibility', 'Potential first-mover advantage'],
        cons: ['Risk of being caught in bubble burst'],
        effects: {
          stakeholderConfidence: 30,
          longTermViability: -20,
          progress: 5,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Wait 2 Quarters - Let market mature',
        description: 'Allow product to reach higher quality and market to stabilize',
        pros: ['Better product readiness', 'Avoid peak hype risks'],
        cons: ['Lose first-mover advantage', 'Reduced excitement'],
        effects: {
          progress: 15,
          stakeholderConfidence: -10,
          longTermViability: 15,
          runway: -2,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Accelerate by 1 Quarter - Beat competitors',
        description: 'Rush to market to be first',
        pros: ['First to market', 'Maximum hype benefit'],
        cons: ['Technical shortcuts required', 'Risk of failure'],
        effects: {
          stakeholderConfidence: 40,
          progress: -15,
          teamMorale: -15,
          technicalDebt: 30,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'D',
        label: 'Delay Indefinitely - Wait for clear GREEN signals',
        description: 'Wait until all market indicators are safe',
        pros: ['Minimal bubble risk', 'Strong technical foundation'],
        cons: ['Miss market window entirely', 'Lose stakeholder support'],
        effects: {
          longTermViability: 30,
          stakeholderConfidence: -50,
          budget: -20,
        },
        riskLevel: 'LOW',
      },
    ],
    learningPoints: [
      'Peak hype presents both opportunity and risk',
      'Strong revenue growth can justify investment even during high strain',
      'First-mover advantage must be balanced against technical readiness',
    ],
    conceptLinks: [
      { slide: 10, concept: 'Boom or Bubble? - Five Gauges' },
      { slide: 16, concept: 'Timing Verdict Framework' },
    ],
  },
  {
    id: 'when_bubble_warning_01',
    dimension: 'WHEN',
    quarter: 8,
    title: 'Bubble Warning Signals',
    context: {
      text: '3 of 5 gauges just turned RED. Economic Strain is at 12% of GDP, Industry Strain is 15x. Funding quality dropping rapidly. But your stakeholders are excited!',
      hypeCycle: 'Peak Hype',
      bubbleGauges: {
        economicStrain: 'RED',
        industryStrain: 'RED',
        revenueGrowth: 'AMBER',
        valuationHeat: 'RED',
        fundingQuality: 'AMBER',
      },
      competitorActivity: 'HIGH',
    },
    options: [
      {
        id: 'A',
        label: 'Ignore warnings - Push forward',
        description: 'Continue as planned, the momentum is too valuable',
        pros: ['Maintain stakeholder excitement', 'Keep momentum'],
        cons: ['High risk of catastrophic failure'],
        effects: {
          stakeholderConfidence: 20,
          longTermViability: -40,
          riskScore: 50,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Defensive strategy - Preserve resources',
        description: 'Slow down, conserve budget, prepare for downturn',
        pros: ['Survive bubble burst', 'Strong foundation'],
        cons: ['Lose competitive position', 'Stakeholder disappointment'],
        effects: {
          stakeholderConfidence: -20,
          longTermViability: 35,
          budget: 15,
          riskScore: -30,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'C',
        label: 'Double down - Bet everything',
        description: 'All-in before the bubble bursts, capture maximum value',
        pros: ['Massive gains if successful'],
        cons: ['Game over if bubble bursts'],
        effects: {
          stakeholderConfidence: 50,
          budget: -50,
          riskScore: 70,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'D',
        label: 'Educate stakeholders - Set realistic expectations',
        description: 'Transparently communicate risks to stakeholders',
        pros: ['Aligned expectations', 'Trust building'],
        cons: ['Immediate confidence drop', 'Possible funding challenges'],
        effects: {
          stakeholderConfidence: -15,
          longTermViability: 25,
          teamMorale: 10,
        },
        riskLevel: 'MEDIUM',
      },
    ],
    learningPoints: [
      '3+ RED gauges signal high bubble risk',
      'Ignoring warning signals leads to catastrophic outcomes',
      'Defensive strategies may feel bad short-term but protect long-term value',
    ],
    conceptLinks: [
      { slide: 10, concept: 'Five Bubble Gauges' },
      { concept: 'Risk Management in Innovation' },
    ],
  },
  {
    id: 'when_trough_opportunity_01',
    dimension: 'WHEN',
    quarter: 10,
    title: 'Trough of Disillusionment',
    context: {
      text: 'The bubble burst. Market is in the Trough. Competitors have failed or withdrawn. All 5 gauges are now GREEN. But investor interest is minimal.',
      hypeCycle: 'Trough of Disillusionment',
      bubbleGauges: {
        economicStrain: 'GREEN',
        industryStrain: 'GREEN',
        revenueGrowth: 'GREEN',
        valuationHeat: 'GREEN',
        fundingQuality: 'GREEN',
      },
      competitorActivity: 'LOW',
    },
    options: [
      {
        id: 'A',
        label: 'Aggressive expansion - Buy the dip',
        description: 'Capitalize on cleared market and low valuations',
        pros: ['Minimal competition', 'Cheap resources', 'Real customers remain'],
        cons: ['Hard to raise funding', 'Low market excitement'],
        effects: {
          progress: 25,
          longTermViability: 40,
          stakeholderConfidence: -10,
          budget: -30,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'B',
        label: 'Maintain course - Steady progress',
        description: 'Keep building without major changes',
        pros: ['Stable', 'Resource efficient'],
        cons: ['Miss opportunity window'],
        effects: {
          progress: 15,
          longTermViability: 20,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'C',
        label: 'Pivot - New direction',
        description: 'Learn from failures and pivot to new approach',
        pros: ['Fresh start', 'Learn from bubble'],
        cons: ['Lose previous progress', 'Confuse stakeholders'],
        effects: {
          progress: -20,
          longTermViability: 30,
          stakeholderConfidence: -25,
          teamMorale: -10,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'D',
        label: 'Wait for plateau - Ultra conservative',
        description: 'Wait until market reaches Plateau of Productivity',
        pros: ['Maximum safety', 'Proven market'],
        cons: ['Very late to market', 'May run out of runway'],
        effects: {
          longTermViability: 20,
          stakeholderConfidence: -30,
          runway: -3,
        },
        riskLevel: 'LOW',
      },
    ],
    learningPoints: [
      'The trough offers unique opportunities for well-prepared companies',
      'GREEN gauges signal safe investment environment',
      'Winners often emerge from the trough, not the peak',
    ],
    conceptLinks: [
      { slide: 8, concept: 'Hype Cycle Stages' },
      { concept: 'Contrarian Investment Strategy' },
    ],
  },
  {
    id: 'when_plateau_launch_01',
    dimension: 'WHEN',
    quarter: 12,
    title: 'Plateau Launch Decision',
    context: {
      text: 'Market has reached Plateau of Productivity. Mature, stable, but competitive. Your innovation is ready. Late mover, but solid fundamentals.',
      hypeCycle: 'Plateau of Productivity',
      bubbleGauges: {
        economicStrain: 'GREEN',
        industryStrain: 'GREEN',
        revenueGrowth: 'GREEN',
        valuationHeat: 'GREEN',
        fundingQuality: 'GREEN',
      },
      competitorActivity: 'MEDIUM',
    },
    options: [
      {
        id: 'A',
        label: 'Launch now - Compete on quality',
        description: 'Enter market with superior product',
        pros: ['Product maturity advantage', 'Learned from early movers'],
        cons: ['Late to market', 'Crowded space'],
        effects: {
          progress: 20,
          longTermViability: 30,
          stakeholderConfidence: 15,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'B',
        label: 'Find niche - Differentiate',
        description: 'Target underserved segment',
        pros: ['Less competition', 'Clear positioning'],
        cons: ['Smaller market', 'May limit growth'],
        effects: {
          progress: 15,
          longTermViability: 35,
          stakeholderConfidence: 10,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'C',
        label: 'Acquisition strategy - Buy market share',
        description: 'Acquire struggling competitor for instant market presence',
        pros: ['Immediate market position', 'Eliminate competitor'],
        cons: ['Expensive', 'Integration challenges'],
        effects: {
          progress: 30,
          budget: -60,
          teamMorale: -10,
        },
        riskLevel: 'MEDIUM',
      },
    ],
    learningPoints: [
      'Late movers can succeed with superior execution',
      'Plateau stage offers stability but requires differentiation',
      'Learning from early movers is a legitimate advantage',
    ],
    conceptLinks: [
      { concept: 'Fast Follower Strategy' },
    ],
  },
  {
    id: 'when_early_stage_01',
    dimension: 'WHEN',
    quarter: 3,
    title: 'Early Stage Opportunity',
    context: {
      text: 'Innovation is still Emerging. Very early. Most indicators GREEN but market size uncertain. You could be first or first to fail.',
      hypeCycle: 'Emerging',
      bubbleGauges: {
        economicStrain: 'GREEN',
        industryStrain: 'GREEN',
        revenueGrowth: 'GREEN',
        valuationHeat: 'GREEN',
        fundingQuality: 'GREEN',
      },
      competitorActivity: 'LOW',
    },
    options: [
      {
        id: 'A',
        label: 'Pioneer - Launch now',
        description: 'Be the first mover and define the category',
        pros: ['First-mover advantage', 'Define standards', 'Maximum learning time'],
        cons: ['Market may not exist', 'Heavy education burden'],
        effects: {
          stakeholderConfidence: 20,
          progress: -10,
          longTermViability: 20,
          budget: -25,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Incubate - Build in stealth',
        description: 'Develop quietly while market forms',
        pros: ['No pressure', 'Time to perfect', 'Learn from early failures'],
        cons: ['May lose timing', 'Stakeholder impatience'],
        effects: {
          progress: 25,
          stakeholderConfidence: -5,
          technicalDebt: -15,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Explore alternatives - Test multiple approaches',
        description: 'Keep options open, run parallel experiments',
        pros: ['Flexibility', 'Reduce risk'],
        cons: ['Resource intensive', 'Slower progress'],
        effects: {
          progress: 10,
          longTermViability: 25,
          budget: -20,
        },
        riskLevel: 'MEDIUM',
      },
    ],
    learningPoints: [
      'Early stage timing is highest risk, highest reward',
      'Pioneers often fail but fast followers succeed',
      'Market uncertainty is the primary risk at this stage',
    ],
    conceptLinks: [
      { slide: 8, concept: 'Hype Cycle - Emerging Stage' },
    ],
  },
];

// WHY Decisions (Promoting)
export const WHY_DECISIONS: Decision[] = [
  {
    id: 'why_framing_01',
    dimension: 'WHY',
    quarter: 4,
    title: 'Internal Communication Strategy',
    context: {
      text: 'Employee survey shows 70% hesitation to speak up. Your manager is prevention-focused (risk-averse). Board meeting in 2 weeks.',
      additionalInfo: {
        managerStyle: 'prevention-focused',
        employeeEngagement: 'low',
        upcomingMilestone: 'board-meeting',
      },
    },
    options: [
      {
        id: 'A',
        label: 'Opportunity Framing',
        description: '"This will transform our market position and create new revenue streams"',
        pros: ['Exciting', 'Forward-looking', 'Inspires action'],
        cons: ['Mismatched with risk-averse manager', 'May be rejected'],
        effects: {
          stakeholderConfidence: -15,
          teamMorale: 10,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Threat Framing',
        description: '"Competitors are moving fast; we risk irrelevance if we don\'t act"',
        pros: ['Matches risk-averse manager mindset', 'Creates urgency'],
        cons: ['May increase anxiety', 'Less inspiring'],
        effects: {
          stakeholderConfidence: 20,
          teamMorale: -5,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Moral Case Aligned with Values',
        description: '"This aligns with our mission to democratize access to technology"',
        pros: ['Strong with value-driven organizations', 'Authentic'],
        cons: ['May seem naive', 'Requires genuine alignment'],
        effects: {
          stakeholderConfidence: 25,
          teamMorale: 15,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'D',
        label: 'Mixed Message (Opportunity + Threat)',
        description: '"Huge opportunity BUT competitors are threatening"',
        pros: ['Covers all bases'],
        cons: ['Research shows this increases rejection rate', 'Confusing'],
        effects: {
          stakeholderConfidence: -20,
          teamMorale: -10,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'E',
        label: 'Make Implementation Easy',
        description: 'Focus on concrete steps, resource plans, timeline',
        pros: ['Reduces perceived difficulty', 'Increases confidence'],
        cons: ['May overlook vision'],
        effects: {
          stakeholderConfidence: 25,
          progress: 10,
        },
        riskLevel: 'LOW',
      },
    ],
    learningPoints: [
      'Message framing should match audience psychology (promotion vs prevention focus)',
      'Mixed messages decrease acceptance rates',
      'Making implementation easy is universally effective',
      'Values-alignment is powerful in mission-driven organizations',
    ],
    conceptLinks: [
      { slide: 25, concept: '7 Practices for Internal Promotion' },
      { concept: 'Regulatory Focus Theory' },
    ],
  },
  {
    id: 'why_expectations_01',
    dimension: 'WHY',
    quarter: 5,
    title: 'Managing Expectations',
    context: {
      text: 'Your stakeholder confidence (85) far exceeds actual progress (45). Theranos warning! Investors are excited but you\'re behind schedule.',
      additionalInfo: {
        confidenceProgressGap: 40,
        theranosWarning: true,
      },
    },
    options: [
      {
        id: 'A',
        label: 'Maintain hype - Hope for breakthrough',
        description: 'Keep stakeholders excited, pray you catch up',
        pros: ['Maintain funding', 'Keep momentum'],
        cons: ['Theranos path', 'Credibility crisis likely'],
        effects: {
          stakeholderConfidence: 10,
          riskScore: 50,
          longTermViability: -30,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Transparent reset - Admit delays',
        description: 'Honest communication about current state',
        pros: ['Rebuild trust', 'Realistic expectations', 'Avoid Theranos trap'],
        cons: ['Confidence drop', 'Possible funding issues'],
        effects: {
          stakeholderConfidence: -30,
          longTermViability: 30,
          teamMorale: 15,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Show partial progress - Cherry-pick wins',
        description: 'Highlight completed work without mentioning delays',
        pros: ['Soften the blow', 'Maintain some confidence'],
        cons: ['Still misleading', 'Band-aid solution'],
        effects: {
          stakeholderConfidence: -10,
          longTermViability: 5,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'D',
        label: 'Pivot messaging - Change definition of success',
        description: 'Reframe what "progress" means',
        pros: ['Avoid admitting failure', 'New narrative'],
        cons: ['Stakeholders see through it', 'Damages credibility'],
        effects: {
          stakeholderConfidence: -20,
          teamMorale: -15,
        },
        riskLevel: 'HIGH',
      },
    ],
    learningPoints: [
      'Confidence > Progress gap of 30+ points is dangerous (Theranos territory)',
      'Transparency is painful short-term but essential long-term',
      'Overpromising creates compound credibility problems',
    ],
    conceptLinks: [
      { slide: 30, concept: 'Theranos Case Study' },
      { concept: 'Managing Expectations vs Reality' },
    ],
  },
  {
    id: 'why_collective_action_01',
    dimension: 'WHY',
    quarter: 7,
    title: 'Building Support Coalition',
    context: {
      text: 'You need 60% of senior leadership support to proceed. Currently at 35%. Two influential VPs are on the fence.',
      additionalInfo: {
        currentSupport: 35,
        targetSupport: 60,
        fenceVPs: 2,
      },
    },
    options: [
      {
        id: 'A',
        label: 'Sequential engagement - One by one',
        description: 'Meet individually, build slowly',
        pros: ['Personalized approach', 'Less risky'],
        cons: ['Slow', 'May not reach threshold'],
        effects: {
          stakeholderConfidence: 15,
          runway: -1,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'B',
        label: 'Collective pitch - All at once',
        description: 'Present to entire leadership team simultaneously',
        pros: ['Fast', 'Creates momentum', 'Peer influence'],
        cons: ['High stakes', 'Groupthink risk'],
        effects: {
          stakeholderConfidence: 30,
          riskScore: 20,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'C',
        label: 'Champion strategy - Convert key influencer first',
        description: 'Focus on most influential VP, let them recruit others',
        pros: ['Leverage social proof', 'Efficient'],
        cons: ['Depends on one person', 'May backfire'],
        effects: {
          stakeholderConfidence: 25,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'D',
        label: 'Pilot program - Prove value first',
        description: 'Small-scale demonstration before asking for full support',
        pros: ['Evidence-based', 'Lower risk for stakeholders'],
        cons: ['Takes time', 'Requires resources'],
        effects: {
          stakeholderConfidence: 20,
          progress: 15,
          budget: -15,
          runway: -2,
        },
        riskLevel: 'LOW',
      },
    ],
    learningPoints: [
      'Collective action theory applies to internal innovation',
      'Champions can multiply your influence',
      'Evidence reduces perceived risk',
    ],
    conceptLinks: [
      { slide: 25, concept: 'Building Internal Support' },
    ],
  },
  {
    id: 'why_storytelling_01',
    dimension: 'WHY',
    quarter: 9,
    title: 'Storytelling Strategy',
    context: {
      text: 'Product demo in 1 week to potential customer and investors. They\'ll decide whether to commit. You need a compelling narrative.',
    },
    options: [
      {
        id: 'A',
        label: 'Problem-Solution Story',
        description: 'Paint vivid picture of customer pain, then reveal solution',
        pros: ['Relatable', 'Creates emotional connection'],
        cons: ['May overemphasize problem'],
        effects: {
          stakeholderConfidence: 25,
          externalCredibility: 20,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'B',
        label: 'Vision-of-Future Story',
        description: 'Describe the transformed world your innovation enables',
        pros: ['Inspirational', 'Big picture thinking'],
        cons: ['May seem unrealistic', 'Misses concrete value'],
        effects: {
          stakeholderConfidence: 20,
          externalCredibility: 15,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Data-Driven Case',
        description: 'Lead with metrics, ROI, evidence',
        pros: ['Credible', 'Rational'],
        cons: ['Less emotionally compelling', 'Boring'],
        effects: {
          stakeholderConfidence: 15,
          externalCredibility: 25,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'D',
        label: 'Personal Journey Story',
        description: 'Share your passion and personal connection to problem',
        pros: ['Authentic', 'Memorable'],
        cons: ['May seem self-indulgent', 'Less professional'],
        effects: {
          stakeholderConfidence: 18,
          externalCredibility: 12,
          teamMorale: 10,
        },
        riskLevel: 'MEDIUM',
      },
    ],
    learningPoints: [
      'Different stories resonate with different audiences',
      'Problem-solution is universally effective',
      'Data alone rarely inspires action',
    ],
    conceptLinks: [
      { concept: 'Storytelling in Innovation' },
    ],
  },
  {
    id: 'why_media_strategy_01',
    dimension: 'WHY',
    quarter: 11,
    title: 'Public Relations Strategy',
    context: {
      text: 'Major tech publication wants to feature your innovation. This could be huge for visibility - or disastrous if premature.',
      additionalInfo: {
        productReadiness: 75,
        publicationReach: 'large',
      },
    },
    options: [
      {
        id: 'A',
        label: 'Full media blitz - Maximum exposure',
        description: 'Say yes to feature, plus proactive outreach',
        pros: ['Massive visibility', 'Investor attention', 'Customer awareness'],
        cons: ['Creates huge expectations', 'Scrutiny if anything fails'],
        effects: {
          stakeholderConfidence: 40,
          externalCredibility: 30,
          riskScore: 30,
        },
        riskLevel: 'HIGH',
      },
      {
        id: 'B',
        label: 'Controlled feature - Work with journalist',
        description: 'Accept feature but carefully manage messaging',
        pros: ['Good visibility', 'Controlled narrative'],
        cons: ['Time intensive', 'May still lose control'],
        effects: {
          stakeholderConfidence: 25,
          externalCredibility: 25,
        },
        riskLevel: 'MEDIUM',
      },
      {
        id: 'C',
        label: 'Decline politely - Not ready',
        description: 'Ask to revisit in 6 months',
        pros: ['Avoid premature scrutiny', 'Launch when ready'],
        cons: ['Miss publicity opportunity', 'May not get second chance'],
        effects: {
          stakeholderConfidence: -10,
          longTermViability: 15,
        },
        riskLevel: 'LOW',
      },
      {
        id: 'D',
        label: 'Stealth approach - Minimal visibility',
        description: 'Stay out of press entirely',
        pros: ['No hype to manage', 'Focus on product'],
        cons: ['Zero visibility', 'Harder customer acquisition'],
        effects: {
          stakeholderConfidence: -15,
          progress: 10,
        },
        riskLevel: 'LOW',
      },
    ],
    learningPoints: [
      'Media attention is double-edged sword',
      'Timing of publicity matters as much as product timing',
      'Hype creates expectations you must deliver on',
    ],
    conceptLinks: [
      { concept: 'Managing Public Expectations' },
    ],
  },
];

// Import additional decisions
import { WHO_DECISIONS, WHAT_DECISIONS, HOW_DECISIONS } from './decisionsWhoWhatHow';

export const ALL_DECISIONS: Decision[] = [
  ...WHEN_DECISIONS,
  ...WHY_DECISIONS,
  ...WHO_DECISIONS,
  ...WHAT_DECISIONS,
  ...HOW_DECISIONS,
];

export function getDecisionsByDimension(dimension: string): Decision[] {
  return ALL_DECISIONS.filter(d => d.dimension === dimension);
}

export function getDecisionById(id: string): Decision | undefined {
  return ALL_DECISIONS.find(d => d.id === id);
}

export function getRandomDecisions(count: number, quarter: number): Decision[] {
  const available = ALL_DECISIONS.filter(d => d.quarter <= quarter);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
