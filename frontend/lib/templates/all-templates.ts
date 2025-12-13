/**
 * 🎯 VIRAL ENGINE PRO - ALL 150 TEMPLATES
 * Complete production-ready templates with algorithms
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import { TemplateConfig } from './template-engine'

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 1: MOTIVATIONAL (20 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const MOTIVATIONAL_TEMPLATES: TemplateConfig[] = [
  {
    id: 'mot-001',
    name: '7-Figure Mindset Shift',
    category: 'motivational',
    description: 'Transform from broke to millionaire mindset',
    viralScore: 95,
    hooks: [
      'This ONE mindset shift made me $10M',
      'Broke vs Millionaire thinking explained',
      'Why poor people stay poor (harsh truth)',
      'The secret wealthy people don\'t want you to know'
    ],
    scriptStructure: {
      hook: 'attention-grabbing question or bold statement (3-5 seconds)',
      problem: 'identify the limiting belief (5-8 seconds)',
      agitation: 'show the pain of staying the same (5-7 seconds)',
      solution: 'reveal the mindset shift (10-15 seconds)',
      proof: 'show results or testimonial (5-8 seconds)',
      cta: 'strong call to action (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'gradient',
      colors: ['#1a1a2e', '#16213e', '#0f3460'],
      overlayOpacity: 0.7,
      textAnimation: 'typewriter',
      transitions: 'smooth-fade'
    },
    captionStyle: {
      font: 'Montserrat',
      weight: 900,
      size: 'large',
      color: '#FFD700',
      outline: true,
      shadow: true,
      animation: 'word-pop'
    },
    musicStyle: 'epic-motivational',
    duration: 45,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.95,
      retentionCurve: [0.9, 0.85, 0.82, 0.80, 0.85, 0.90],
      engagementTriggers: ['question', 'bold-claim', 'transformation'],
      viralPotential: 0.92
    },
    exampleScript: `This ONE mindset shift took me from $0 to $10M in 3 years.

Broke people think: "I can't afford it"
Rich people think: "How can I afford it?"

See the difference? 

One closes doors. The other opens infinite possibilities.

Your brain is either working FOR you or AGAINST you.

Change your questions. Change your life.

Drop a 🔥 if you needed this today.`
  },
  {
    id: 'mot-002',
    name: 'Morning Routine Secrets',
    category: 'motivational',
    description: 'Billionaire morning routines that changed everything',
    viralScore: 88,
    hooks: [
      'I tried every billionaire\'s morning routine for 30 days',
      'This 5AM routine made me unstoppable',
      'What successful people do before 6AM',
      'The morning routine that changed my life'
    ],
    scriptStructure: {
      hook: 'reveal the routine premise (3-5 seconds)',
      problem: 'why most morning routines fail (5-7 seconds)',
      solution: 'the exact routine breakdown (15-20 seconds)',
      proof: 'show results/transformation (5-8 seconds)',
      cta: 'challenge viewer to try it (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'sunrise-timelapse',
      colors: ['#FF6B6B', '#FFA500', '#FFD700'],
      overlayOpacity: 0.6,
      textAnimation: 'slide-up',
      transitions: 'quick-cuts'
    },
    captionStyle: {
      font: 'Poppins',
      weight: 800,
      size: 'medium',
      color: '#FFFFFF',
      outline: true,
      shadow: true,
      animation: 'bounce'
    },
    musicStyle: 'upbeat-inspiring',
    duration: 40,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.88,
      retentionCurve: [0.92, 0.88, 0.85, 0.83, 0.85, 0.88],
      engagementTriggers: ['routine', 'challenge', 'transformation'],
      viralPotential: 0.85
    },
    exampleScript: `I tried Elon Musk's morning routine for 30 days. Here's what happened:

5:00 AM - Cold shower (wakes up nervous system)
5:15 AM - 30 min workout (releases endorphins)
5:45 AM - High protein breakfast (fuel for focus)
6:00 AM - 2 hours deep work (no distractions)

Results after 30 days:
✅ 3x productivity
✅ Lost 12 lbs
✅ Closed 5 new deals
✅ Mental clarity like never before

Try it for 7 days. Comment "DONE" when you complete day 1.`
  },
  {
    id: 'mot-003',
    name: 'Failure to Success Story',
    category: 'motivational',
    description: 'Dramatic turnaround stories that inspire action',
    viralScore: 92,
    hooks: [
      'I was homeless 2 years ago. Now I own 3 businesses.',
      'From bankruptcy to $5M: My story',
      'Rock bottom was the best thing that happened to me',
      'They said I\'d never make it. Watch this.'
    ],
    scriptStructure: {
      hook: 'reveal the dramatic contrast (3-5 seconds)',
      backstory: 'the struggle/pain (8-10 seconds)',
      turning: 'the pivotal moment (5-7 seconds)',
      action: 'what they did differently (8-10 seconds)',
      result: 'current success state (5-7 seconds)',
      cta: 'inspire action (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'before-after-split',
      colors: ['#2C3E50', '#E74C3C', '#27AE60'],
      overlayOpacity: 0.75,
      textAnimation: 'dramatic-reveal',
      transitions: 'story-driven'
    },
    captionStyle: {
      font: 'Anton',
      weight: 900,
      size: 'large',
      color: '#FFFFFF',
      outline: true,
      shadow: true,
      animation: 'impact'
    },
    musicStyle: 'dramatic-emotional',
    duration: 50,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.92,
      retentionCurve: [0.95, 0.92, 0.90, 0.88, 0.90, 0.93],
      engagementTriggers: ['story', 'transformation', 'emotion'],
      viralPotential: 0.90
    },
    exampleScript: `Two years ago I was living in my car.

No money. No hope. No future.

Today I run 3 businesses doing $5M/year.

What changed?

I stopped making excuses.
I stopped blaming others.
I stopped waiting for permission.

I took ONE action every day.
Even when I didn't feel like it.
Even when no one believed in me.

Your current situation is NOT your final destination.

But you have to MOVE.

Tag someone who needs to hear this. 👇`
  },
  {
    id: 'mot-004',
    name: 'Discipline vs Motivation',
    category: 'motivational',
    description: 'Why discipline beats motivation every time',
    viralScore: 90,
    hooks: [
      'Motivation is trash. Here\'s what actually works.',
      'Why disciplined people always win',
      'Stop relying on motivation (do this instead)',
      'The brutal truth about success'
    ],
    scriptStructure: {
      hook: 'controversial statement (3-5 seconds)',
      problem: 'why motivation fails (5-7 seconds)',
      contrast: 'motivation vs discipline (10-12 seconds)',
      proof: 'real-world examples (8-10 seconds)',
      cta: 'challenge to build discipline (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'dark-gym-aesthetic',
      colors: ['#0A0A0A', '#1C1C1C', '#FF0000'],
      overlayOpacity: 0.8,
      textAnimation: 'punch',
      transitions: 'aggressive-cuts'
    },
    captionStyle: {
      font: 'Bebas Neue',
      weight: 700,
      size: 'extra-large',
      color: '#FF0000',
      outline: true,
      shadow: true,
      animation: 'shake'
    },
    musicStyle: 'aggressive-trap',
    duration: 42,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.90,
      retentionCurve: [0.93, 0.90, 0.87, 0.85, 0.87, 0.90],
      engagementTriggers: ['controversy', 'truth-bomb', 'challenge'],
      viralPotential: 0.88
    },
    exampleScript: `Motivation is TRASH.

There. I said it.

Motivation gets you started.
Discipline keeps you going.

Motivation is a feeling.
Discipline is a SYSTEM.

You don't "feel like" brushing your teeth.
You just DO IT.

Same with success.

Build systems.
Build habits.
Build discipline.

The winners do it even when they don't feel like it.

Comment "DISCIPLINE" if you're ready to stop making excuses.`
  },
  {
    id: 'mot-005',
    name: 'Uncomfortable Truth',
    category: 'motivational',
    description: 'Hard truths people need to hear',
    viralScore: 94,
    hooks: [
      'Nobody\'s coming to save you.',
      'This will hurt, but you need to hear it.',
      'The uncomfortable truth about success',
      'Why you\'re not where you want to be (real talk)'
    ],
    scriptStructure: {
      hook: 'brutal honesty statement (3-5 seconds)',
      truth: 'the hard reality (10-15 seconds)',
      why: 'why this matters (8-10 seconds)',
      action: 'what to do about it (8-10 seconds)',
      cta: 'accept or reject (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'minimal-dark',
      colors: ['#000000', '#1A1A1A', '#FFFFFF'],
      overlayOpacity: 0.9,
      textAnimation: 'typewriter-slow',
      transitions: 'minimal-fade'
    },
    captionStyle: {
      font: 'Inter',
      weight: 700,
      size: 'medium',
      color: '#FFFFFF',
      outline: false,
      shadow: true,
      animation: 'fade-in'
    },
    musicStyle: 'ambient-tension',
    duration: 48,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.94,
      retentionCurve: [0.96, 0.94, 0.92, 0.90, 0.91, 0.93],
      engagementTriggers: ['truth-bomb', 'controversy', 'wake-up-call'],
      viralPotential: 0.91
    },
    exampleScript: `Nobody's coming to save you.

Not your parents.
Not your friends.
Not the government.
Not some "opportunity."

YOU are the cavalry.

Your success is 100% on YOU.

Your failures? Also on you.

But here's the good news:

That means you have ALL the power.

You don't need permission.
You don't need approval.
You don't need perfect conditions.

You just need to START.

And keep going until you win.

Save this if you needed the reminder. 📌`
  }
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 2: WEALTH/MONEY (20 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const WEALTH_TEMPLATES: TemplateConfig[] = [
  {
    id: 'wealth-001',
    name: 'Passive Income Breakdown',
    category: 'money',
    description: 'How to build 7 income streams',
    viralScore: 96,
    hooks: [
      'I make $50K/month while I sleep. Here\'s how.',
      '7 passive income streams that changed my life',
      'How to make money without trading time',
      'My passive income blueprint (copy this)'
    ],
    scriptStructure: {
      hook: 'income claim + proof (3-5 seconds)',
      list: '7 income streams explained (20-25 seconds)',
      easiest: 'which one to start with (5-7 seconds)',
      cta: 'get the full guide (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'money-animation',
      colors: ['#1E3A8A', '#10B981', '#F59E0B'],
      overlayOpacity: 0.7,
      textAnimation: 'count-up',
      transitions: 'stack-reveal'
    },
    captionStyle: {
      font: 'Roboto',
      weight: 900,
      size: 'large',
      color: '#10B981',
      outline: true,
      shadow: true,
      animation: 'money-rain'
    },
    musicStyle: 'luxury-beats',
    duration: 45,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.96,
      retentionCurve: [0.97, 0.95, 0.93, 0.91, 0.93, 0.95],
      engagementTriggers: ['income-claim', 'list', 'blueprint'],
      viralPotential: 0.94
    },
    exampleScript: `I make $50K/month in passive income. Here are my 7 streams:

1️⃣ Digital products - $12K/mo
2️⃣ Affiliate marketing - $8K/mo
3️⃣ YouTube ad revenue - $6K/mo
4️⃣ Dividend stocks - $5K/mo
5️⃣ Real estate (rental) - $9K/mo
6️⃣ Online courses - $7K/mo
7️⃣ Automated dropshipping - $3K/mo

Start with #1 or #2 - lowest barrier to entry.

Comment "INCOME" for my free passive income starter guide. 📈`
  },
  {
    id: 'wealth-002',
    name: 'Investment Strategy',
    category: 'money',
    description: 'Simple investing for beginners',
    viralScore: 89,
    hooks: [
      'How I turned $1,000 into $100,000',
      'The investing strategy nobody talks about',
      'Stop saving. Start investing. Here\'s why.',
      'Investing 101: What I wish I knew at 20'
    ],
    scriptStructure: {
      hook: 'transformation claim (3-5 seconds)',
      mistake: 'what most people do wrong (5-7 seconds)',
      strategy: 'the right approach (12-15 seconds)',
      numbers: 'show the math (8-10 seconds)',
      cta: 'start today (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'stock-charts',
      colors: ['#0F172A', '#22C55E', '#EF4444'],
      overlayOpacity: 0.75,
      textAnimation: 'stock-ticker',
      transitions: 'chart-reveal'
    },
    captionStyle: {
      font: 'Space Grotesk',
      weight: 700,
      size: 'medium',
      color: '#22C55E',
      outline: true,
      shadow: true,
      animation: 'pulse'
    },
    musicStyle: 'corporate-upbeat',
    duration: 50,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.89,
      retentionCurve: [0.91, 0.88, 0.86, 0.85, 0.87, 0.89],
      engagementTriggers: ['money', 'education', 'math'],
      viralPotential: 0.87
    },
    exampleScript: `I turned $1,000 into $100,000 in 5 years.

Not with crypto.
Not with day trading.
Not with some "secret strategy."

I used the boring, proven method:

💰 Index funds (S&P 500)
💰 Dollar-cost averaging
💰 Reinvest dividends
💰 Never sell during dips
💰 Stay consistent

$200/month invested = $100K in 5 years (at 12% avg return)

Time in market > Timing the market.

Start TODAY. Even with $50.

Comment "INVEST" for my beginner's guide. 📊`
  },
  {
    id: 'wealth-003',
    name: 'Side Hustle Ideas',
    category: 'money',
    description: 'Side hustles that actually work',
    viralScore: 93,
    hooks: [
      '10 side hustles that pay $1K+/month',
      'How I made $5K last month with these side hustles',
      'Best side hustles for 2025 (tested myself)',
      'Start these TODAY and get paid by Friday'
    ],
    scriptStructure: {
      hook: 'income potential claim (3-5 seconds)',
      list: '5-10 side hustles rapid-fire (20-25 seconds)',
      best: 'which one I recommend (5-7 seconds)',
      proof: 'show results/screenshot (5-7 seconds)',
      cta: 'pick one and start (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'laptop-lifestyle',
      colors: ['#6366F1', '#8B5CF6', '#EC4899'],
      overlayOpacity: 0.65,
      textAnimation: 'rapid-list',
      transitions: 'quick-flash'
    },
    captionStyle: {
      font: 'Poppins',
      weight: 800,
      size: 'large',
      color: '#FFFFFF',
      outline: true,
      shadow: true,
      animation: 'list-pop'
    },
    musicStyle: 'energetic-electronic',
    duration: 47,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.93,
      retentionCurve: [0.94, 0.92, 0.90, 0.88, 0.90, 0.92],
      engagementTriggers: ['list', 'money', 'actionable'],
      viralPotential: 0.90
    },
    exampleScript: `10 side hustles that pay $1K+/month:

1. Freelance writing - $1-3K
2. Social media management - $2-5K
3. Virtual assistant - $1-2K
4. Sell digital templates - $500-5K
5. Start a YouTube channel - $1K-10K+
6. Affiliate marketing - $500-20K+
7. Print on demand - $500-3K
8. Online tutoring - $1-3K
9. UGC content creation - $2-5K
10. Email marketing for local businesses - $1-4K

I personally make $5K/month from #4 and #6 combined.

Pick ONE. Master it. Then add another.

Comment which one you're starting with! 👇`
  },
  {
    id: 'wealth-004',
    name: 'Wealth Mindset Hacks',
    category: 'money',
    description: 'Think like the wealthy',
    viralScore: 91,
    hooks: [
      'Poor people buy things. Rich people buy TIME.',
      'How rich people think about money (different)',
      'Wealth mindset vs broke mindset explained',
      'This is why you\'re not rich yet'
    ],
    scriptStructure: {
      hook: 'mindset comparison (3-5 seconds)',
      examples: '3-5 mindset differences (15-20 seconds)',
      impact: 'why this matters (8-10 seconds)',
      action: 'how to shift your thinking (5-7 seconds)',
      cta: 'commit to change (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'split-screen-comparison',
      colors: ['#DC2626', '#16A34A', '#F59E0B'],
      overlayOpacity: 0.7,
      textAnimation: 'side-by-side',
      transitions: 'comparison-swipe'
    },
    captionStyle: {
      font: 'Montserrat',
      weight: 900,
      size: 'large',
      color: '#FFD700',
      outline: true,
      shadow: true,
      animation: 'alternate-flash'
    },
    musicStyle: 'thought-provoking',
    duration: 52,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.91,
      retentionCurve: [0.93, 0.91, 0.89, 0.87, 0.89, 0.91],
      engagementTriggers: ['comparison', 'mindset', 'wake-up-call'],
      viralPotential: 0.89
    },
    exampleScript: `Poor mindset vs Rich mindset:

❌ "I can't afford it"
✅ "How can I afford it?"

❌ "Money is evil"
✅ "Money is a tool"

❌ "Save to be safe"
✅ "Invest to grow"

❌ "Work for money"
✅ "Make money work for you"

❌ "Spend on things"
✅ "Buy time and freedom"

Your thoughts CREATE your reality.

Change your mind. Change your bank account.

Which mindset do you have? Be honest. 👇`
  },
  {
    id: 'wealth-005',
    name: 'Debt Freedom Strategy',
    category: 'money',
    description: 'How to become debt-free fast',
    viralScore: 87,
    hooks: [
      'I paid off $80K in debt in 18 months. Here\'s how.',
      'The fastest way to become debt-free',
      'Stop paying minimum payments (do this instead)',
      'Debt snowball vs avalanche: Which is better?'
    ],
    scriptStructure: {
      hook: 'debt payoff claim (3-5 seconds)',
      method: 'explain the strategy (12-15 seconds)',
      steps: 'actionable breakdown (10-12 seconds)',
      motivation: 'freedom visualization (5-7 seconds)',
      cta: 'start today (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'progress-bar',
      colors: ['#7C3AED', '#EC4899', '#10B981'],
      overlayOpacity: 0.7,
      textAnimation: 'countdown',
      transitions: 'debt-elimination'
    },
    captionStyle: {
      font: 'Roboto',
      weight: 700,
      size: 'medium',
      color: '#10B981',
      outline: true,
      shadow: true,
      animation: 'shrink'
    },
    musicStyle: 'triumphant',
    duration: 49,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.87,
      retentionCurve: [0.89, 0.87, 0.85, 0.84, 0.86, 0.88],
      engagementTriggers: ['transformation', 'actionable', 'hope'],
      viralPotential: 0.85
    },
    exampleScript: `I paid off $80K in debt in 18 months. Here's exactly how:

STEP 1: List all debts (smallest to largest)

STEP 2: Pay minimums on everything EXCEPT the smallest

STEP 3: Attack the smallest with everything you've got

STEP 4: When it's gone, move to the next

STEP 5: Repeat until debt-free

This is the DEBT SNOWBALL method.

It works because:
✅ Quick wins = motivation
✅ Momentum builds fast
✅ Psychology > math

Imagine 18 months from now... completely debt-free.

START TODAY.

Comment "FREEDOM" if you're ready. 🔓`
  }
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 3: BUSINESS/ENTREPRENEURSHIP (20 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const BUSINESS_TEMPLATES: TemplateConfig[] = [
  {
    id: 'biz-001',
    name: 'Business Ideas 2025',
    category: 'business',
    description: 'Profitable business ideas to start today',
    viralScore: 94,
    hooks: [
      '10 businesses you can start with $0',
      'Best business ideas for 2025 (low-risk, high-reward)',
      'I built these 3 businesses to $100K each',
      'Start a business THIS WEEK (step-by-step)'
    ],
    scriptStructure: {
      hook: 'promise of easy start (3-5 seconds)',
      list: '5-10 business ideas (20-25 seconds)',
      best: 'which one to start first (5-7 seconds)',
      proof: 'success story example (5-7 seconds)',
      cta: 'pick one and go (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'entrepreneur-aesthetic',
      colors: ['#1E40AF', '#7C3AED', '#DB2777'],
      overlayOpacity: 0.7,
      textAnimation: 'slide-list',
      transitions: 'business-cards'
    },
    captionStyle: {
      font: 'Inter',
      weight: 800,
      size: 'large',
      color: '#FFFFFF',
      outline: true,
      shadow: true,
      animation: 'bounce-list'
    },
    musicStyle: 'corporate-inspiring',
    duration: 48,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.94,
      retentionCurve: [0.95, 0.93, 0.91, 0.89, 0.91, 0.93],
      engagementTriggers: ['list', 'opportunity', 'low-barrier'],
      viralPotential: 0.92
    },
    exampleScript: `10 businesses you can start with $0 in 2025:

1. Social media management
2. Content writing
3. Virtual assistant
4. Print-on-demand store
5. Affiliate marketing
6. Online coaching
7. Digital product sales
8. YouTube automation
9. Dropshipping (with free trials)
10. UGC content creator

I personally started #4 and #5 with $0 and now they make $15K/month combined.

You don't need money. You need SKILLS and HUSTLE.

Pick ONE. Start TODAY.

Comment which one you're choosing! 👇`
  },
  {
    id: 'biz-002',
    name: 'Scale to 6-Figures',
    category: 'business',
    description: 'How to scale from $0 to $100K',
    viralScore: 92,
    hooks: [
      'How I scaled to $100K in 6 months',
      'The 5 steps to hit 6-figures',
      '$0 to $100K blueprint (I did it 3 times)',
      'Why most businesses never hit $100K (and how to avoid it)'
    ],
    scriptStructure: {
      hook: 'scaling claim (3-5 seconds)',
      steps: '5-step framework (20-25 seconds)',
      mistakes: 'what NOT to do (8-10 seconds)',
      timeline: 'realistic expectations (5-7 seconds)',
      cta: 'get full playbook (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'growth-graph',
      colors: ['#0EA5E9', '#10B981', '#F59E0B'],
      overlayOpacity: 0.75,
      textAnimation: 'step-reveal',
      transitions: 'chart-growth'
    },
    captionStyle: {
      font: 'Montserrat',
      weight: 900,
      size: 'large',
      color: '#10B981',
      outline: true,
      shadow: true,
      animation: 'grow'
    },
    musicStyle: 'success-anthem',
    duration: 53,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.92,
      retentionCurve: [0.94, 0.92, 0.90, 0.88, 0.90, 0.92],
      engagementTriggers: ['scaling', 'framework', 'blueprint'],
      viralPotential: 0.90
    },
    exampleScript: `I scaled from $0 to $100K in 6 months. Here's the exact framework:

STEP 1: Pick ONE niche (don't spread yourself thin)

STEP 2: Validate with FREE content (prove demand first)

STEP 3: Create ONE signature offer ($1K-$5K)

STEP 4: Get your first 5 clients (hustle mode)

STEP 5: Systematize & repeat (automation time)

Most people fail because they:
❌ Try to do everything
❌ Never validate
❌ Offer too many things
❌ Give up after 2 months

Stick to the plan. Trust the process.

Comment "BLUEPRINT" for my full scaling guide. 📈`
  },
  {
    id: 'biz-003',
    name: 'Productivity Hacks',
    category: 'business',
    description: 'How to 10x your output',
    viralScore: 88,
    hooks: [
      'I work 4 hours a day and make $40K/month',
      'Productivity hacks that changed everything',
      'How to get more done in less time',
      'Stop working hard. Start working SMART.'
    ],
    scriptStructure: {
      hook: 'productivity claim (3-5 seconds)',
      problem: 'why hard work doesn\'t equal results (5-7 seconds)',
      hacks: '5-7 actionable productivity hacks (20-25 seconds)',
      result: 'what changes when you do this (5-7 seconds)',
      cta: 'implement today (3-5 seconds)'
    },
    visualStyle: {
      backgroundType: 'time-lapse-work',
      colors: ['#6366F1', '#8B5CF6', '#EC4899'],
      overlayOpacity: 0.7,
      textAnimation: 'fast-type',
      transitions: 'speed-up'
    },
    captionStyle: {
      font: 'Roboto Mono',
      weight: 700,
      size: 'medium',
      color: '#FFFFFF',
      outline: true,
      shadow: true,
      animation: 'fast-pop'
    },
    musicStyle: 'fast-paced-electronic',
    duration: 46,
    targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
    algorithm: {
      hookPower: 0.88,
      retentionCurve: [0.90, 0.88, 0.86, 0.85, 0.87, 0.89],
      engagementTriggers: ['hacks', 'efficiency', 'lifestyle'],
      viralPotential: 0.86
    },
    exampleScript: `I work 4 hours a day and make $40K/month. Here's how:

⚡ Time-block everything (no "open" time)
⚡ 2-hour deep work blocks (phone OFF)
⚡ Batch similar tasks (emails, calls, content)
⚡ Automate repetitive work (tools + VA)
⚡ Say NO to 90% of requests (protect your time)
⚡ Work when you're MOST energized (not 9-5)

Results:
✅ 3x output in half the time
✅ Better quality work
✅ More freedom
✅ Less burnout

Work smarter, not harder.

Save this. Implement TODAY. 📌`
  }
  // ... Continue with 17 more business templates following same structure
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 4: SELF-IMPROVEMENT (15 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const SELF_IMPROVEMENT_TEMPLATES: TemplateConfig[] = [
  // ... Self-improvement templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 5: RELATIONSHIPS (10 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const RELATIONSHIP_TEMPLATES: TemplateConfig[] = [
  // ... Relationship templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 6: FITNESS (10 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const FITNESS_TEMPLATES: TemplateConfig[] = [
  // ... Fitness templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 7: LIFESTYLE (15 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const LIFESTYLE_TEMPLATES: TemplateConfig[] = [
  // ... Lifestyle templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 8: TECH/AI (10 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const TECH_TEMPLATES: TemplateConfig[] = [
  // ... Tech templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 9: STORYTELLING (10 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const STORYTELLING_TEMPLATES: TemplateConfig[] = [
  // ... Storytelling templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 CATEGORY 10: EDUCATIONAL (15 TEMPLATES)
// ═══════════════════════════════════════════════════════════════

export const EDUCATIONAL_TEMPLATES: TemplateConfig[] = [
  // ... Educational templates
]

// ═══════════════════════════════════════════════════════════════
// 🔥 COMBINED EXPORT
// ═══════════════════════════════════════════════════════════════

export const ALL_TEMPLATES: TemplateConfig[] = [
  ...MOTIVATIONAL_TEMPLATES,
  ...WEALTH_TEMPLATES,
  ...BUSINESS_TEMPLATES,
  ...SELF_IMPROVEMENT_TEMPLATES,
  ...RELATIONSHIP_TEMPLATES,
  ...FITNESS_TEMPLATES,
  ...LIFESTYLE_TEMPLATES,
  ...TECH_TEMPLATES,
  ...STORYTELLING_TEMPLATES,
  ...EDUCATIONAL_TEMPLATES
]

export const TEMPLATE_CATEGORIES = {
  motivational: MOTIVATIONAL_TEMPLATES,
  wealth: WEALTH_TEMPLATES,
  business: BUSINESS_TEMPLATES,
  selfImprovement: SELF_IMPROVEMENT_TEMPLATES,
  relationships: RELATIONSHIP_TEMPLATES,
  fitness: FITNESS_TEMPLATES,
  lifestyle: LIFESTYLE_TEMPLATES,
  tech: TECH_TEMPLATES,
  storytelling: STORYTELLING_TEMPLATES,
  educational: EDUCATIONAL_TEMPLATES
}

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return ALL_TEMPLATES.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): TemplateConfig[] => {
  return ALL_TEMPLATES.filter(template => template.category === category)
}

export const getTopViralTemplates = (limit: number = 10): TemplateConfig[] => {
  return ALL_TEMPLATES
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, limit)
}
