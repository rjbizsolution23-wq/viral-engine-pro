/**
 * VIRAL ENGINE PRO - AI SCRIPT GENERATOR
 * Complete AI-powered script generation system
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface ScriptGenerationParams {
  prompt: string
  tone: 'casual' | 'professional' | 'humorous' | 'dramatic' | 'mysterious'
  style: 'storytelling' | 'informative' | 'engaging' | 'persuasive'
  maxLength?: number
  hooks?: string[]
  targetAudience?: string
  platform?: 'tiktok' | 'youtube' | 'instagram'
}

export async function generateAIScript(
  params: ScriptGenerationParams
): Promise<string> {
  const {
    prompt,
    tone,
    style,
    maxLength = 500,
    hooks = [],
    targetAudience = 'Gen Z',
    platform = 'tiktok'
  } = params

  // Build system prompt
  const systemPrompt = buildSystemPrompt({
    tone,
    style,
    maxLength,
    targetAudience,
    platform
  })

  // Build user prompt with hooks
  const userPrompt = buildUserPrompt(prompt, hooks)

  // Use Claude for script generation
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    temperature: 0.9,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  })

  // Extract script from response
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text.trim()
}

function buildSystemPrompt(params: {
  tone: string
  style: string
  maxLength: number
  targetAudience: string
  platform: string
}): string {
  return `You are an expert viral video scriptwriter specializing in ${params.platform} content for ${params.targetAudience}.

Your scripts are designed to:
- Hook viewers in the first 3 seconds
- Maintain engagement throughout
- Trigger emotional responses
- Encourage shares and comments
- Optimize for ${params.platform} algorithm

TONE: ${params.tone}
STYLE: ${params.style}
MAX LENGTH: ${params.maxLength} words

CRITICAL RULES:
1. Start with a POWERFUL hook (question, shocking statement, or mystery)
2. Use short, punchy sentences
3. Include pattern interrupts every 5-7 seconds
4. Build curiosity loops (create questions, answer them later)
5. Use the "But wait..." technique
6. End with a strong CTA or cliffhanger

FORBIDDEN:
- Generic openings ("Today I'm going to tell you about...")
- Slow buildup
- Filler words
- Corporate speak
- Long explanations without payoff

OUTPUT FORMAT:
- Pure script text (no markdown, no labels)
- Natural speaking language
- Clear pause points (use ellipsis ... for dramatic pauses)
- Write EXACTLY how it should be spoken

Remember: This will be read by AI voice-over. Make it conversational and engaging.`
}

function buildUserPrompt(basePrompt: string, hooks: string[]): string {
  let prompt = basePrompt

  if (hooks.length > 0) {
    prompt += `\n\nConsider using one of these viral hooks:\n${hooks.map(h => `- ${h}`).join('\n')}`
  }

  prompt += '\n\nGenerate a viral-optimized script that follows all the rules above.'

  return prompt
}

/**
 * Generate multiple script variations
 */
export async function generateScriptVariations(
  params: ScriptGenerationParams,
  count: number = 3
): Promise<string[]> {
  const variations = await Promise.all(
    Array.from({ length: count }).map(() => generateAIScript(params))
  )

  return variations
}

/**
 * Analyze script for viral potential
 */
export async function analyzeScriptViralPotential(
  script: string
): Promise<{
  score: number
  strengths: string[]
  improvements: string[]
  hooks: string[]
  emotionalTriggers: string[]
}> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `Analyze this video script for viral potential (TikTok/YouTube Shorts):

${script}

Provide analysis in this exact JSON format:
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "hooks": ["identified hook phrases"],
  "emotionalTriggers": ["trigger1", "trigger2", ...]
}`
      }
    ]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return JSON.parse(content.text)
}

/**
 * Generate trending topic scripts
 */
export async function generateTrendingScripts(params: {
  trend: string
  templateType: string
  count?: number
}): Promise<string[]> {
  const systemPrompt = `You are a viral content strategist. Generate multiple script variations for the trending topic: "${params.trend}"

Template type: ${params.templateType}

Each script should:
- Capitalize on the trend's momentum
- Add unique perspective or twist
- Be optimized for virality
- Include trending keywords naturally
- Hook viewers immediately

Output ${params.count || 3} complete scripts, separated by "---SCRIPT---"`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    temperature: 0.95,
    messages: [
      {
        role: 'user',
        content: `Generate scripts for: ${params.trend}`
      }
    ],
    system: systemPrompt
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return content.text.split('---SCRIPT---').map(s => s.trim()).filter(Boolean)
}

/**
 * Optimize existing script
 */
export async function optimizeScript(
  script: string,
  targetMetrics: {
    increaseHooks?: boolean
    increaseEmotionalImpact?: boolean
    shortenLength?: boolean
    improveClarity?: boolean
  }
): Promise<string> {
  const optimizations: string[] = []

  if (targetMetrics.increaseHooks) {
    optimizations.push('Add more powerful hooks and pattern interrupts')
  }
  if (targetMetrics.increaseEmotionalImpact) {
    optimizations.push('Amplify emotional triggers and storytelling elements')
  }
  if (targetMetrics.shortenLength) {
    optimizations.push('Condense to more punchy, concise sentences')
  }
  if (targetMetrics.improveClarity) {
    optimizations.push('Simplify language and improve flow')
  }

  const systemPrompt = `You are optimizing a viral video script. Apply these improvements:
${optimizations.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Maintain the core message but make it MORE VIRAL.
Output only the optimized script (no explanations).`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: script
      }
    ]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return content.text.trim()
}

/**
 * Generate script from Reddit post
 */
export async function generateScriptFromReddit(params: {
  postUrl?: string
  postTitle?: string
  postContent?: string
  commentHighlights?: string[]
}): Promise<string> {
  const prompt = `Create a viral video script from this Reddit content:

Title: ${params.postTitle || 'Untitled'}
Content: ${params.postContent || ''}
${params.commentHighlights?.length ? `\nTop Comments:\n${params.commentHighlights.join('\n')}` : ''}

Transform this into an engaging, story-driven script that:
- Starts with the most shocking/interesting part
- Builds suspense
- Includes key details and reactions
- Ends with impact

Write in conversational, first-person narrative style.`

  return await generateAIScript({
    prompt,
    tone: 'dramatic',
    style: 'storytelling',
    maxLength: 400,
    platform: 'tiktok'
  })
}

/**
 * Generate script from Twitter thread
 */
export async function generateScriptFromTwitter(params: {
  threadUrl?: string
  tweets: string[]
}): Promise<string> {
  const prompt = `Create a viral video script from this Twitter thread:

${params.tweets.map((t, i) => `Tweet ${i + 1}: ${t}`).join('\n\n')}

Condense the key points into a compelling narrative that:
- Captures the thread's main message
- Maintains the original voice/tone
- Adds dramatic pacing
- Makes it video-friendly

Keep it punchy and fast-paced.`

  return await generateAIScript({
    prompt,
    tone: 'casual',
    style: 'engaging',
    maxLength: 300,
    platform: 'tiktok'
  })
}

/**
 * Generate "Would You Rather" script
 */
export async function generateWouldYouRatherScript(params: {
  option1: string
  option2: string
  context?: string
}): Promise<string> {
  const prompt = `Create a viral "Would You Rather" video script:

Option 1: ${params.option1}
Option 2: ${params.option2}
${params.context ? `Context: ${params.context}` : ''}

Structure:
1. Hook with the question
2. Explain option 1 (pros/cons)
3. Explain option 2 (pros/cons)
4. Add a twist or surprising perspective
5. End with "Comment your choice!"

Make it engaging and thought-provoking.`

  return await generateAIScript({
    prompt,
    tone: 'humorous',
    style: 'engaging',
    maxLength: 250,
    platform: 'tiktok'
  })
}

/**
 * Generate motivational script
 */
export async function generateMotivationalScript(params: {
  topic: string
  targetAudience?: string
}): Promise<string> {
  const prompt = `Create a powerful motivational video script about: ${params.topic}

Target audience: ${params.targetAudience || 'young entrepreneurs'}

Structure:
1. Relatable struggle/pain point
2. Shift in perspective
3. Actionable insights
4. Empowering close

Make it authentic, not cheesy. Use real talk, not platitudes.`

  return await generateAIScript({
    prompt,
    tone: 'professional',
    style: 'persuasive',
    maxLength: 350,
    platform: 'youtube',
    hooks: [
      'Stop doing this if you want to succeed...',
      'Nobody talks about this, but...',
      'I wasted 5 years before I learned this...'
    ]
  })
}
