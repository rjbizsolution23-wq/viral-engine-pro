/**
 * VIRAL ENGINE PRO - TEMPLATE TYPE DEFINITIONS
 * Complete type system for templates
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: TemplateCategoryType
  subcategory?: string
  thumbnail: string
  previewVideo?: string
  isPremium: boolean
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number // in seconds
  
  // Input configuration
  inputs: TemplateInput[]
  
  // Script generation logic
  scriptLogic: {
    useAI: boolean
    tone: 'casual' | 'professional' | 'humorous' | 'dramatic' | 'mysterious'
    style: 'storytelling' | 'informative' | 'engaging' | 'persuasive'
    promptTemplate?: string
    maxLength?: number
    hooks?: string[] // Opening hooks
  }
  
  // Scene configuration
  scenes: SceneTemplate[]
  
  // Visual styling
  captionStyle: CaptionStyleType
  transitions: TransitionType[]
  globalEffects: EffectType[]
  
  // Audio configuration
  voice: {
    defaultVoiceId: string
    allowCustomVoice: boolean
    speed: number
    pitch: number
  }
  
  music: {
    enabled: boolean
    defaultTrack?: string
    allowCustomMusic: boolean
    volume: number
  }
  
  // Output configuration
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5'
  resolution: {
    width: number
    height: number
  }
  
  // Analytics
  popularity: number
  averageViralScore: number
  usageCount: number
  lastUpdated: string
}

export type TemplateCategoryType =
  | 'fake-text'
  | 'reddit-stories'
  | 'ai-stories'
  | 'would-you-rather'
  | 'split-screen'
  | 'voiceover'
  | 'top-lists'
  | 'twitter-threads'
  | 'gaming-rants'
  | 'asmr'
  | 'creepypasta'
  | 'conspiracy'
  | 'educational'
  | 'motivational'
  | 'comedy'
  | 'horror'
  | 'mystery'
  | 'facts'
  | 'life-hacks'
  | 'relationships'

export interface TemplateInput {
  id: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'select' | 'multiselect' | 'file' | 'color' | 'number'
  placeholder?: string
  required: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    options?: Array<{ value: string; label: string }>
  }
  defaultValue?: any
  tooltip?: string
}

export interface SceneTemplate {
  id: string
  type: 'intro' | 'main' | 'outro' | 'transition' | 'hook' | 'cta'
  duration?: number
  textTemplate?: string
  backgroundType: BackgroundType
  animation: AnimationType
  captionStyle: CaptionStyleType
  musicTrack?: string
  effects?: EffectType[]
}

export type BackgroundType =
  | 'minecraft-parkour'
  | 'subway-surfers'
  | 'gta-driving'
  | 'satisfying-clips'
  | 'nature-footage'
  | 'abstract-shapes'
  | 'anime-clips'
  | 'stock-footage'
  | 'ai-generated'
  | 'solid-color'
  | 'gradient'
  | 'particles'
  | 'code-typing'
  | 'space'
  | 'ocean'
  | 'fire'
  | 'rain'

export type AnimationType =
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'rotate'
  | 'shake'
  | 'bounce'
  | 'typewriter'
  | 'glitch'
  | 'wave'
  | 'pulse'
  | 'none'

export type CaptionStyleType =
  | 'modern'
  | 'bold'
  | 'minimal'
  | 'neon'
  | 'retro'
  | 'handwritten'
  | 'comic'
  | 'elegant'
  | 'grunge'
  | 'kawaii'
  | 'alex-hormozi'
  | 'mr-beast'
  | 'vsauce'

export interface CaptionStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  color: string
  backgroundColor?: string
  strokeColor?: string
  strokeWidth?: number
  shadow?: {
    x: number
    y: number
    blur: number
    color: string
  }
  animation: 'word-by-word' | 'letter-by-letter' | 'line-by-line' | 'none'
  position: 'top' | 'center' | 'bottom'
  maxWidth: number
  padding: number
}

export type TransitionType =
  | 'cut'
  | 'fade'
  | 'wipe'
  | 'slide'
  | 'zoom'
  | 'spin'
  | 'blur'
  | 'glitch'
  | 'morph'

export type EffectType =
  | 'vignette'
  | 'chromatic-aberration'
  | 'film-grain'
  | 'color-grading'
  | 'blur'
  | 'sharpen'
  | 'glow'
  | 'lens-flare'
  | 'particles'
  | 'light-leaks'
  | 'distortion'
  | 'scanlines'

export interface VideoScene {
  id: string
  text: string
  duration: number
  type: 'intro' | 'main' | 'outro' | 'transition' | 'hook' | 'cta'
  animation: AnimationType
  backgroundType: BackgroundType
  captionStyle: CaptionStyleType
  musicTrack?: string
  effects: EffectType[]
}

export interface AIVoiceConfig {
  provider: 'elevenlabs' | 'minimax' | 'google' | 'azure' | 'openai'
  voiceId: string
  speed: number
  pitch: number
  stability?: number
  clarity?: number
  style?: number
  useSpeakerBoost?: boolean
}

export interface MusicTrack {
  id: string
  name: string
  genre: string
  mood: string
  duration: number
  bpm: number
  url: string
  tags: string[]
}

export interface BackgroundVideoClip {
  id: string
  type: BackgroundType
  url: string
  duration: number
  resolution: {
    width: number
    height: number
  }
  tags: string[]
}

export interface VideoCompositionParams {
  jobId: string
  scenes: VideoScene[]
  voiceovers: Array<{ sceneId: string; audioUrl: string }>
  backgrounds: Array<{ sceneId: string; videoUrl: string }>
  captions: {
    enabled: boolean
    style: CaptionStyleType
    position: 'top' | 'center' | 'bottom'
    fontSize: number
    fontFamily: string
    animation: 'word-by-word' | 'letter-by-letter' | 'line-by-line' | 'none'
  }
  music: {
    enabled: boolean
    track: string
    volume: number
  }
  transitions: TransitionType[]
  effects: EffectType[]
  outputFormat: 'mp4' | 'webm' | 'mov'
  resolution: {
    width: number
    height: number
  }
}

export interface TrendAnalysis {
  topic: string
  score: number
  sources: string[]
  keywords: string[]
  suggestedTemplates: string[]
  viralPotential: number
  competitionLevel: 'low' | 'medium' | 'high'
  recommendedPostingTime: string
}

export interface BulkGenerationJob {
  id: string
  templateId: string
  count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  completedCount: number
  failedCount: number
  videos: Array<{
    id: string
    url: string
    status: 'pending' | 'completed' | 'failed'
  }>
  createdAt: string
  completedAt?: string
}

export interface ScheduledPost {
  id: string
  videoUrl: string
  platforms: ('tiktok' | 'youtube' | 'instagram' | 'facebook')[]
  scheduledTime: string
  caption: string
  hashtags: string[]
  status: 'scheduled' | 'posting' | 'posted' | 'failed'
  postedUrls?: Record<string, string>
}
