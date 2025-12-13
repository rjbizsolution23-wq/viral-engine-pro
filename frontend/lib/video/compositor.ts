/**
 * VIRAL ENGINE PRO - VIDEO COMPOSITOR
 * FFmpeg-powered video composition and rendering engine
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import { VideoCompositionParams, VideoScene } from '../templates/types'
import { getCaptionStyle } from './caption-styles'
import axios from 'axios'

/**
 * Main video composition function
 * Combines scenes, voiceovers, backgrounds, captions, music, effects
 */
export async function composeVideo(
  params: VideoCompositionParams
): Promise<string> {
  // Send composition job to backend FFmpeg service
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/video/compose`,
    {
      jobId: params.jobId,
      composition: buildCompositionConfig(params)
    },
    {
      timeout: 300000 // 5 minute timeout for video processing
    }
  )

  // Poll for job completion
  let videoUrl = ''
  let attempts = 0
  const maxAttempts = 120 // 10 minutes max (5 second intervals)

  while (!videoUrl && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000))

    const statusResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/video/status/${params.jobId}`
    )

    if (statusResponse.data.status === 'completed') {
      videoUrl = statusResponse.data.videoUrl
    } else if (statusResponse.data.status === 'failed') {
      throw new Error(`Video composition failed: ${statusResponse.data.error}`)
    }

    attempts++
  }

  if (!videoUrl) {
    throw new Error('Video composition timeout')
  }

  return videoUrl
}

/**
 * Build FFmpeg composition configuration
 */
function buildCompositionConfig(params: VideoCompositionParams): CompositionConfig {
  const config: CompositionConfig = {
    resolution: params.resolution,
    outputFormat: params.outputFormat,
    scenes: [],
    globalEffects: params.effects,
    musicTrack: params.music.enabled ? params.music.track : undefined,
    musicVolume: params.music.volume
  }

  let currentTimestamp = 0

  // Build each scene
  params.scenes.forEach((scene, index) => {
    const voiceover = params.voiceovers.find(v => v.sceneId === scene.id)
    const background = params.backgrounds.find(b => b.sceneId === scene.id)

    const sceneConfig: SceneConfig = {
      startTime: currentTimestamp,
      endTime: currentTimestamp + scene.duration,
      duration: scene.duration,
      backgroundVideoUrl: background?.videoUrl || '',
      voiceoverAudioUrl: voiceover?.audioUrl || '',
      captions: params.captions.enabled ? {
        text: scene.text,
        style: getCaptionStyle(params.captions.style),
        position: params.captions.position,
        animation: params.captions.animation
      } : undefined,
      effects: scene.effects,
      transition: index < params.transitions.length ? params.transitions[index] : 'cut'
    }

    config.scenes.push(sceneConfig)
    currentTimestamp += scene.duration
  })

  return config
}

/**
 * Generate FFmpeg command for video composition
 */
export function generateFFmpegCommand(config: CompositionConfig): string {
  const commands: string[] = []
  
  // Input files
  const inputs: string[] = []
  let inputIndex = 0

  // Add background videos
  config.scenes.forEach((scene, i) => {
    inputs.push(`-i "${scene.backgroundVideoUrl}"`)
    scene.backgroundInputIndex = inputIndex++
  })

  // Add voiceover audios
  config.scenes.forEach((scene, i) => {
    if (scene.voiceoverAudioUrl) {
      inputs.push(`-i "${scene.voiceoverAudioUrl}"`)
      scene.voiceoverInputIndex = inputIndex++
    }
  })

  // Add music track
  if (config.musicTrack) {
    inputs.push(`-i "${config.musicTrack}"`)
    config.musicInputIndex = inputIndex++
  }

  // Filter complex for video processing
  const filterComplex: string[] = []
  let videoStreamName = '[v0]'
  let audioStreams: string[] = []

  config.scenes.forEach((scene, i) => {
    // Process background video
    const bgInput = `[${scene.backgroundInputIndex}:v]`
    
    // Scale and crop to target resolution
    filterComplex.push(
      `${bgInput}scale=${config.resolution.width}:${config.resolution.height}:force_original_aspect_ratio=increase,crop=${config.resolution.width}:${config.resolution.height}[bg${i}]`
    )

    // Trim to scene duration
    filterComplex.push(
      `[bg${i}]trim=duration=${scene.duration},setpts=PTS-STARTPTS[bg${i}_trimmed]`
    )

    // Add captions if enabled
    if (scene.captions) {
      const captionFilter = buildCaptionFilter(scene.captions, i)
      filterComplex.push(captionFilter)
    }

    // Apply scene effects
    if (scene.effects && scene.effects.length > 0) {
      const effectsFilter = buildEffectsFilter(scene.effects, i)
      filterComplex.push(effectsFilter)
    }

    // Process voiceover audio
    if (scene.voiceoverInputIndex !== undefined) {
      filterComplex.push(
        `[${scene.voiceoverInputIndex}:a]atrim=duration=${scene.duration},asetpts=PTS-STARTPTS[audio${i}]`
      )
      audioStreams.push(`[audio${i}]`)
    }
  })

  // Concatenate video scenes
  const videoConcat = config.scenes.map((_, i) => `[v${i}_final]`).join('')
  filterComplex.push(
    `${videoConcat}concat=n=${config.scenes.length}:v=1:a=0[vout]`
  )

  // Concatenate audio streams
  if (audioStreams.length > 0) {
    const audioConcat = audioStreams.join('')
    filterComplex.push(
      `${audioConcat}concat=n=${audioStreams.length}:v=0:a=1[aout]`
    )
  }

  // Mix with background music if enabled
  if (config.musicTrack && config.musicInputIndex !== undefined) {
    filterComplex.push(
      `[aout][${config.musicInputIndex}:a]amix=inputs=2:duration=first:weights=1 ${config.musicVolume}[afinal]`
    )
  } else {
    filterComplex.push(`[aout]acopy[afinal]`)
  }

  // Apply global effects
  if (config.globalEffects && config.globalEffects.length > 0) {
    const globalEffectsFilter = buildGlobalEffectsFilter(config.globalEffects)
    filterComplex.push(globalEffectsFilter)
  }

  // Build final command
  const command = [
    'ffmpeg',
    ...inputs,
    '-filter_complex',
    `"${filterComplex.join(';')}"`,
    '-map', '[vout]',
    '-map', '[afinal]',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    `output.${config.outputFormat}`
  ].join(' ')

  return command
}

/**
 * Build caption filter for FFmpeg
 */
function buildCaptionFilter(
  captions: {
    text: string
    style: any
    position: string
    animation: string
  },
  sceneIndex: number
): string {
  const style = captions.style

  // Escape text for FFmpeg
  const escapedText = captions.text
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')

  // Position mapping
  const positions: Record<string, string> = {
    top: '(w-text_w)/2:h*0.1',
    center: '(w-text_w)/2:(h-text_h)/2',
    bottom: '(w-text_w)/2:h*0.85'
  }

  const position = positions[captions.position] || positions.center

  // Build drawtext filter
  let filter = `[v${sceneIndex}_effects]drawtext=`
  filter += `text='${escapedText}':`
  filter += `fontfile=/usr/share/fonts/${style.fontFamily}.ttf:`
  filter += `fontsize=${style.fontSize}:`
  filter += `fontcolor=${style.color}:`
  filter += `x=${position}:`
  filter += `borderw=${style.strokeWidth || 0}:`
  filter += `bordercolor=${style.strokeColor || '0x000000'}:`

  // Add shadow if configured
  if (style.shadow) {
    filter += `shadowx=${style.shadow.x}:`
    filter += `shadowy=${style.shadow.y}:`
    filter += `shadowcolor=${style.shadow.color}:`
  }

  // Add animation based on type
  if (captions.animation === 'word-by-word') {
    // Word-by-word reveal animation
    filter += `enable='between(t,0,${3})':` // Show for 3 seconds
  }

  filter += `[v${sceneIndex}_caption]`

  return filter
}

/**
 * Build effects filter chain
 */
function buildEffectsFilter(effects: string[], sceneIndex: number): string {
  let filter = `[v${sceneIndex}_trimmed]`

  effects.forEach(effect => {
    switch (effect) {
      case 'vignette':
        filter += `vignette=angle=PI/4:mode=forward,`
        break
      case 'chromatic-aberration':
        filter += `chromashift=crh=3:cbh=-3,`
        break
      case 'film-grain':
        filter += `noise=c0s=20:allf=t,`
        break
      case 'blur':
        filter += `boxblur=2:1,`
        break
      case 'sharpen':
        filter += `unsharp=5:5:1.0:5:5:0.0,`
        break
      case 'glow':
        filter += `gblur=sigma=10,`
        break
      case 'scanlines':
        filter += `interlace,`
        break
      default:
        break
    }
  })

  // Remove trailing comma
  filter = filter.replace(/,$/, '')
  filter += `[v${sceneIndex}_effects]`

  return filter
}

/**
 * Build global effects filter
 */
function buildGlobalEffectsFilter(effects: string[]): string {
  let filter = '[vout]'

  effects.forEach(effect => {
    switch (effect) {
      case 'color-grading':
        filter += `eq=contrast=1.1:brightness=0.05:saturation=1.2,`
        break
      case 'film-grain':
        filter += `noise=c0s=15:allf=t,`
        break
      case 'vignette':
        filter += `vignette=angle=PI/3,`
        break
      default:
        break
    }
  })

  filter = filter.replace(/,$/, '')
  filter += '[vfinal]'

  return filter
}

/**
 * Add transitions between scenes
 */
function buildTransitionFilter(
  transition: string,
  scene1: number,
  scene2: number,
  duration: number = 0.5
): string {
  const transitionMap: Record<string, string> = {
    fade: `xfade=transition=fade:duration=${duration}:offset=${duration}`,
    wipe: `xfade=transition=wipeleft:duration=${duration}:offset=${duration}`,
    slide: `xfade=transition=slideleft:duration=${duration}:offset=${duration}`,
    zoom: `xfade=transition=zoomin:duration=${duration}:offset=${duration}`,
    spin: `xfade=transition=circleopen:duration=${duration}:offset=${duration}`,
    blur: `xfade=transition=fadeblack:duration=${duration}:offset=${duration}`,
    glitch: `xfade=transition=pixelize:duration=${duration}:offset=${duration}`
  }

  const transitionFilter = transitionMap[transition] || transitionMap.fade

  return `[v${scene1}][v${scene2}]${transitionFilter}[v${scene2}_trans]`
}

/**
 * Optimize video for web/mobile delivery
 */
export async function optimizeVideoForDelivery(
  videoUrl: string,
  options: {
    targetPlatform: 'tiktok' | 'youtube' | 'instagram' | 'web'
    quality?: 'high' | 'medium' | 'low'
  }
): Promise<string> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/video/optimize`,
    {
      videoUrl,
      platform: options.targetPlatform,
      quality: options.quality || 'high'
    }
  )

  return response.data.optimizedUrl
}

/**
 * Generate video thumbnail
 */
export async function generateThumbnail(
  videoUrl: string,
  timestamp: number = 1
): Promise<string> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/video/thumbnail`,
    {
      videoUrl,
      timestamp
    }
  )

  return response.data.thumbnailUrl
}

/**
 * Get video metadata
 */
export async function getVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/video/metadata`,
    { videoUrl }
  )

  return response.data
}

// Types
interface CompositionConfig {
  resolution: {
    width: number
    height: number
  }
  outputFormat: string
  scenes: SceneConfig[]
  globalEffects: string[]
  musicTrack?: string
  musicVolume: number
  musicInputIndex?: number
}

interface SceneConfig {
  startTime: number
  endTime: number
  duration: number
  backgroundVideoUrl: string
  backgroundInputIndex?: number
  voiceoverAudioUrl: string
  voiceoverInputIndex?: number
  captions?: {
    text: string
    style: any
    position: string
    animation: string
  }
  effects: string[]
  transition: string
}

interface VideoMetadata {
  duration: number
  width: number
  height: number
  fps: number
  bitrate: number
  codec: string
  fileSize: number
}
