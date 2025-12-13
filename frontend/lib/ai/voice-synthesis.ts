/**
 * VIRAL ENGINE PRO - VOICE SYNTHESIS ENGINE
 * Multi-provider AI voice generation system
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import { ElevenLabsClient } from 'elevenlabs'
import axios from 'axios'

// Initialize ElevenLabs
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!
})

export interface VoiceSynthesisParams {
  text: string
  voiceId: string
  provider?: 'elevenlabs' | 'minimax' | 'google' | 'openai'
  speed?: number
  pitch?: number
  stability?: number
  clarity?: number
  style?: number
  useSpeakerBoost?: boolean
  outputFormat?: 'mp3' | 'wav' | 'pcm'
}

/**
 * Main voice synthesis function - routes to appropriate provider
 */
export async function synthesizeVoice(
  params: VoiceSynthesisParams
): Promise<string> {
  const provider = params.provider || 'elevenlabs'

  switch (provider) {
    case 'elevenlabs':
      return await synthesizeWithElevenLabs(params)
    case 'minimax':
      return await synthesizeWithMinimax(params)
    case 'google':
      return await synthesizeWithGoogle(params)
    case 'openai':
      return await synthesizeWithOpenAI(params)
    default:
      throw new Error(`Unsupported voice provider: ${provider}`)
  }
}

/**
 * ElevenLabs voice synthesis (PRIMARY - highest quality)
 */
async function synthesizeWithElevenLabs(
  params: VoiceSynthesisParams
): Promise<string> {
  try {
    const audio = await elevenlabs.textToSpeech.convert(params.voiceId, {
      text: params.text,
      model_id: 'eleven_turbo_v2_5', // Fastest, lowest latency
      voice_settings: {
        stability: params.stability || 0.5,
        similarity_boost: params.clarity || 0.75,
        style: params.style || 0.0,
        use_speaker_boost: params.useSpeakerBoost !== false
      },
      output_format: params.outputFormat || 'mp3_44100_128'
    })

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Upload to storage and return URL
    const audioUrl = await uploadAudioToStorage(buffer, 'mp3')
    return audioUrl
  } catch (error) {
    console.error('ElevenLabs synthesis error:', error)
    throw new Error(`ElevenLabs synthesis failed: ${error}`)
  }
}

/**
 * Minimax voice synthesis (ALTERNATIVE - good for multilingual)
 */
async function synthesizeWithMinimax(
  params: VoiceSynthesisParams
): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.minimax.chat/v1/text_to_speech',
      {
        text: params.text,
        voice_id: params.voiceId,
        speed: params.speed || 1.0,
        vol: 1.0,
        pitch: params.pitch || 0,
        audio_sample_rate: 24000,
        bitrate: 128000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    )

    const audioUrl = await uploadAudioToStorage(
      Buffer.from(response.data),
      'mp3'
    )
    return audioUrl
  } catch (error) {
    console.error('Minimax synthesis error:', error)
    throw new Error(`Minimax synthesis failed: ${error}`)
  }
}

/**
 * Google Cloud TTS (FALLBACK)
 */
async function synthesizeWithGoogle(
  params: VoiceSynthesisParams
): Promise<string> {
  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        input: { text: params.text },
        voice: {
          languageCode: 'en-US',
          name: params.voiceId,
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: params.speed || 1.0,
          pitch: params.pitch || 0.0,
          volumeGainDb: 0.0,
          sampleRateHertz: 24000,
          effectsProfileId: ['small-bluetooth-speaker-class-device']
        }
      }
    )

    const audioBuffer = Buffer.from(response.data.audioContent, 'base64')
    const audioUrl = await uploadAudioToStorage(audioBuffer, 'mp3')
    return audioUrl
  } catch (error) {
    console.error('Google TTS error:', error)
    throw new Error(`Google TTS failed: ${error}`)
  }
}

/**
 * OpenAI TTS (ALTERNATIVE - good quality, fast)
 */
async function synthesizeWithOpenAI(
  params: VoiceSynthesisParams
): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1-hd',
        input: params.text,
        voice: params.voiceId || 'nova',
        speed: params.speed || 1.0,
        response_format: 'mp3'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    )

    const audioUrl = await uploadAudioToStorage(
      Buffer.from(response.data),
      'mp3'
    )
    return audioUrl
  } catch (error) {
    console.error('OpenAI TTS error:', error)
    throw new Error(`OpenAI TTS failed: ${error}`)
  }
}

/**
 * Get available voices from all providers
 */
export async function getAvailableVoices(
  provider?: 'elevenlabs' | 'minimax' | 'google' | 'openai'
): Promise<Voice[]> {
  if (provider) {
    switch (provider) {
      case 'elevenlabs':
        return await getElevenLabsVoices()
      case 'minimax':
        return await getMinimaxVoices()
      case 'google':
        return await getGoogleVoices()
      case 'openai':
        return await getOpenAIVoices()
    }
  }

  // Get all voices from all providers
  const [elevenLabs, minimax, google, openai] = await Promise.all([
    getElevenLabsVoices(),
    getMinimaxVoices(),
    getGoogleVoices(),
    getOpenAIVoices()
  ])

  return [...elevenLabs, ...minimax, ...google, ...openai]
}

async function getElevenLabsVoices(): Promise<Voice[]> {
  try {
    const response = await elevenlabs.voices.getAll()
    return response.voices.map(voice => ({
      id: voice.voice_id,
      name: voice.name,
      provider: 'elevenlabs',
      language: 'en',
      gender: voice.labels?.gender || 'neutral',
      accent: voice.labels?.accent || 'american',
      age: voice.labels?.age || 'adult',
      style: voice.labels?.['use case'] || 'general',
      previewUrl: voice.preview_url || undefined,
      isPremium: voice.category === 'premade' || voice.category === 'professional'
    }))
  } catch (error) {
    console.error('Failed to fetch ElevenLabs voices:', error)
    return []
  }
}

async function getMinimaxVoices(): Promise<Voice[]> {
  // Minimax voice list (static for now)
  return [
    {
      id: 'male-qn-qingse',
      name: 'Male - Energetic',
      provider: 'minimax',
      language: 'en',
      gender: 'male',
      accent: 'american',
      age: 'young-adult',
      style: 'energetic'
    },
    {
      id: 'female-shaonv',
      name: 'Female - Friendly',
      provider: 'minimax',
      language: 'en',
      gender: 'female',
      accent: 'american',
      age: 'young-adult',
      style: 'friendly'
    },
    {
      id: 'male-qn-jingying',
      name: 'Male - Professional',
      provider: 'minimax',
      language: 'en',
      gender: 'male',
      accent: 'american',
      age: 'adult',
      style: 'professional'
    },
    {
      id: 'female-yujie',
      name: 'Female - Mature',
      provider: 'minimax',
      language: 'en',
      gender: 'female',
      accent: 'american',
      age: 'adult',
      style: 'mature'
    }
  ]
}

async function getGoogleVoices(): Promise<Voice[]> {
  try {
    const response = await axios.get(
      `https://texttospeech.googleapis.com/v1/voices?key=${process.env.GOOGLE_API_KEY}`
    )

    return response.data.voices
      .filter((v: any) => v.languageCodes.includes('en-US'))
      .map((voice: any) => ({
        id: voice.name,
        name: voice.name.replace('en-US-', '').replace('-', ' '),
        provider: 'google',
        language: 'en',
        gender: voice.ssmlGender.toLowerCase(),
        accent: 'american',
        age: 'adult',
        style: voice.name.includes('Studio') ? 'professional' : 'general'
      }))
  } catch (error) {
    console.error('Failed to fetch Google voices:', error)
    return []
  }
}

async function getOpenAIVoices(): Promise<Voice[]> {
  // OpenAI voice list (static)
  return [
    {
      id: 'alloy',
      name: 'Alloy',
      provider: 'openai',
      language: 'en',
      gender: 'neutral',
      accent: 'american',
      age: 'adult',
      style: 'general'
    },
    {
      id: 'echo',
      name: 'Echo',
      provider: 'openai',
      language: 'en',
      gender: 'male',
      accent: 'american',
      age: 'adult',
      style: 'general'
    },
    {
      id: 'fable',
      name: 'Fable',
      provider: 'openai',
      language: 'en',
      gender: 'neutral',
      accent: 'british',
      age: 'adult',
      style: 'storytelling'
    },
    {
      id: 'onyx',
      name: 'Onyx',
      provider: 'openai',
      language: 'en',
      gender: 'male',
      accent: 'american',
      age: 'adult',
      style: 'professional'
    },
    {
      id: 'nova',
      name: 'Nova',
      provider: 'openai',
      language: 'en',
      gender: 'female',
      accent: 'american',
      age: 'young-adult',
      style: 'energetic'
    },
    {
      id: 'shimmer',
      name: 'Shimmer',
      provider: 'openai',
      language: 'en',
      gender: 'female',
      accent: 'american',
      age: 'young-adult',
      style: 'friendly'
    }
  ]
}

/**
 * Clone a custom voice (ElevenLabs only)
 */
export async function cloneVoice(params: {
  name: string
  description: string
  audioFiles: Buffer[]
}): Promise<string> {
  try {
    const voice = await elevenlabs.voices.add({
      name: params.name,
      description: params.description,
      files: params.audioFiles.map((buffer, i) => 
        new File([buffer], `sample_${i}.mp3`, { type: 'audio/mpeg' })
      )
    })

    return voice.voice_id
  } catch (error) {
    console.error('Voice cloning error:', error)
    throw new Error(`Voice cloning failed: ${error}`)
  }
}

/**
 * Upload audio buffer to Cloudflare R2 storage
 */
async function uploadAudioToStorage(
  buffer: Buffer,
  format: string
): Promise<string> {
  const filename = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${format}`

  // Upload to Cloudflare R2 via API
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/storage/upload`,
    {
      filename,
      data: buffer.toString('base64'),
      contentType: `audio/${format}`
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
      }
    }
  )

  return response.data.url
}

/**
 * Batch voice synthesis for multiple text segments
 */
export async function batchSynthesizeVoice(
  segments: Array<{ text: string; voiceId: string }>,
  provider?: 'elevenlabs' | 'minimax' | 'google' | 'openai'
): Promise<string[]> {
  const audioUrls = await Promise.all(
    segments.map(segment =>
      synthesizeVoice({
        text: segment.text,
        voiceId: segment.voiceId,
        provider
      })
    )
  )

  return audioUrls
}

/**
 * Get voice synthesis estimate (characters and cost)
 */
export async function getVoiceSynthesisEstimate(params: {
  text: string
  provider: 'elevenlabs' | 'minimax' | 'google' | 'openai'
}): Promise<{
  characters: number
  estimatedDuration: number
  estimatedCost: number
}> {
  const characters = params.text.length

  // Average speaking rate: 150 words per minute = 2.5 words per second
  const words = params.text.split(/\s+/).length
  const estimatedDuration = words / 2.5

  // Cost per character (approximate)
  const costPerCharacter = {
    elevenlabs: 0.00003, // $0.30 per 10K characters
    minimax: 0.00002, // $0.20 per 10K characters
    google: 0.000016, // $0.016 per 1K characters
    openai: 0.000015 // $0.015 per 1K characters
  }

  const estimatedCost = characters * costPerCharacter[params.provider]

  return {
    characters,
    estimatedDuration,
    estimatedCost
  }
}

// Types
interface Voice {
  id: string
  name: string
  provider: 'elevenlabs' | 'minimax' | 'google' | 'openai'
  language: string
  gender: 'male' | 'female' | 'neutral'
  accent: string
  age: 'child' | 'young-adult' | 'adult' | 'senior'
  style: string
  previewUrl?: string
  isPremium?: boolean
}
