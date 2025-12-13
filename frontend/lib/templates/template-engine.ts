/**
 * VIRAL ENGINE PRO - TEMPLATE ENGINE
 * Complete template processing and rendering system
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import { TemplateConfig, VideoScene, AIVoiceConfig } from './types'
import { generateAIScript } from '../ai/script-generator'
import { synthesizeVoice } from '../ai/voice-synthesis'
import { generateBackgroundVideo } from '../video/background-generator'
import { composeVideo } from '../video/compositor'

export class TemplateEngine {
  private templates: Map<string, TemplateConfig>

  constructor() {
    this.templates = new Map()
  }

  /**
   * Register a template with the engine
   */
  registerTemplate(template: TemplateConfig) {
    this.templates.set(template.id, template)
  }

  /**
   * Get all templates by category
   */
  getTemplatesByCategory(category: string): TemplateConfig[] {
    return Array.from(this.templates.values()).filter(
      t => t.category === category
    )
  }

  /**
   * Process a template with user inputs
   */
  async processTemplate(
    templateId: string,
    userInputs: Record<string, any>,
    options: {
      voiceId?: string
      backgroundStyle?: string
      duration?: number
      outputFormat?: 'mp4' | 'webm' | 'mov'
    } = {}
  ): Promise<VideoGenerationJob> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Step 1: Generate AI script based on template logic
    const script = await this.generateScriptFromTemplate(template, userInputs)

    // Step 2: Generate scenes with timing
    const scenes = await this.generateScenes(template, script, options)

    // Step 3: Synthesize voiceovers for each scene
    const voiceovers = await this.synthesizeVoiceovers(scenes, options.voiceId)

    // Step 4: Generate or fetch background videos
    const backgrounds = await this.generateBackgrounds(scenes, options.backgroundStyle)

    // Step 5: Compose final video
    const videoUrl = await this.composeVideo({
      jobId,
      scenes,
      voiceovers,
      backgrounds,
      template,
      outputFormat: options.outputFormat || 'mp4'
    })

    return {
      jobId,
      templateId,
      status: 'completed',
      videoUrl,
      duration: scenes.reduce((sum, s) => sum + s.duration, 0),
      createdAt: new Date().toISOString()
    }
  }

  /**
   * Generate script from template logic
   */
  private async generateScriptFromTemplate(
    template: TemplateConfig,
    userInputs: Record<string, any>
  ): Promise<string> {
    // Execute template's script generation logic
    if (template.scriptLogic?.useAI) {
      return await generateAIScript({
        prompt: this.buildPrompt(template, userInputs),
        tone: template.scriptLogic.tone,
        style: template.scriptLogic.style,
        maxLength: template.scriptLogic.maxLength
      })
    }

    // Use template-based script generation
    return this.buildScriptFromTemplate(template, userInputs)
  }

  /**
   * Build prompt for AI script generation
   */
  private buildPrompt(
    template: TemplateConfig,
    userInputs: Record<string, any>
  ): string {
    let prompt = template.scriptLogic?.promptTemplate || ''

    // Replace placeholders with user inputs
    Object.keys(userInputs).forEach(key => {
      const placeholder = `{{${key}}}`
      prompt = prompt.replace(new RegExp(placeholder, 'g'), userInputs[key])
    })

    return prompt
  }

  /**
   * Build script from template structure
   */
  private buildScriptFromTemplate(
    template: TemplateConfig,
    userInputs: Record<string, any>
  ): string {
    const parts: string[] = []

    template.scenes.forEach((scene, index) => {
      let sceneText = scene.textTemplate || ''

      // Replace placeholders
      Object.keys(userInputs).forEach(key => {
        const placeholder = `{{${key}}}`
        sceneText = sceneText.replace(
          new RegExp(placeholder, 'g'),
          userInputs[key]
        )
      })

      parts.push(sceneText)
    })

    return parts.join('\n\n')
  }

  /**
   * Generate video scenes with timing
   */
  private async generateScenes(
    template: TemplateConfig,
    script: string,
    options: any
  ): Promise<VideoScene[]> {
    const scenes: VideoScene[] = []
    const scriptParts = script.split('\n\n')

    for (let i = 0; i < template.scenes.length; i++) {
      const sceneTemplate = template.scenes[i]
      const text = scriptParts[i] || ''

      scenes.push({
        id: `scene_${i}`,
        text,
        duration: sceneTemplate.duration || this.calculateDuration(text),
        type: sceneTemplate.type,
        animation: sceneTemplate.animation,
        backgroundType: sceneTemplate.backgroundType,
        captionStyle: sceneTemplate.captionStyle,
        musicTrack: sceneTemplate.musicTrack,
        effects: sceneTemplate.effects || []
      })
    }

    return scenes
  }

  /**
   * Calculate scene duration based on text length
   */
  private calculateDuration(text: string): number {
    // Average speaking rate: 150 words per minute = 2.5 words per second
    const words = text.split(/\s+/).length
    const baseDuration = (words / 2.5) + 0.5 // Add 0.5s buffer
    return Math.max(baseDuration, 3) // Minimum 3 seconds
  }

  /**
   * Synthesize voiceovers for all scenes
   */
  private async synthesizeVoiceovers(
    scenes: VideoScene[],
    voiceId?: string
  ): Promise<Array<{ sceneId: string; audioUrl: string }>> {
    const voiceovers = await Promise.all(
      scenes.map(async scene => {
        const audioUrl = await synthesizeVoice({
          text: scene.text,
          voiceId: voiceId || 'default',
          speed: 1.0,
          pitch: 1.0
        })

        return {
          sceneId: scene.id,
          audioUrl
        }
      })
    )

    return voiceovers
  }

  /**
   * Generate background videos for scenes
   */
  private async generateBackgrounds(
    scenes: VideoScene[],
    backgroundStyle?: string
  ): Promise<Array<{ sceneId: string; videoUrl: string }>> {
    const backgrounds = await Promise.all(
      scenes.map(async scene => {
        const videoUrl = await generateBackgroundVideo({
          type: scene.backgroundType,
          style: backgroundStyle || 'cinematic',
          duration: scene.duration,
          prompt: scene.text
        })

        return {
          sceneId: scene.id,
          videoUrl
        }
      })
    )

    return backgrounds
  }

  /**
   * Compose final video from scenes
   */
  private async composeVideo(params: {
    jobId: string
    scenes: VideoScene[]
    voiceovers: Array<{ sceneId: string; audioUrl: string }>
    backgrounds: Array<{ sceneId: string; videoUrl: string }>
    template: TemplateConfig
    outputFormat: string
  }): Promise<string> {
    return await composeVideo({
      jobId: params.jobId,
      scenes: params.scenes,
      voiceovers: params.voiceovers,
      backgrounds: params.backgrounds,
      captions: {
        enabled: true,
        style: params.template.captionStyle || 'modern',
        position: 'bottom',
        fontSize: 48,
        fontFamily: 'Montserrat',
        animation: 'word-by-word'
      },
      music: {
        enabled: params.template.music?.enabled || false,
        track: params.template.music?.defaultTrack || 'upbeat_1',
        volume: 0.3
      },
      transitions: params.template.transitions || [],
      effects: params.template.globalEffects || [],
      outputFormat: params.outputFormat,
      resolution: {
        width: 1080,
        height: 1920 // TikTok/Instagram format
      }
    })
  }
}

// Interfaces
interface VideoGenerationJob {
  jobId: string
  templateId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  duration?: number
  createdAt: string
  error?: string
}

// Export singleton instance
export const templateEngine = new TemplateEngine()
