/**
 * VIRAL ENGINE PRO - CAPTION STYLES
 * Pre-configured caption styles for viral videos
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import { CaptionStyle } from '../templates/types'

/**
 * Get caption style configuration
 */
export function getCaptionStyle(styleName: string): CaptionStyle {
  const styles: Record<string, CaptionStyle> = {
    modern: {
      fontFamily: 'Montserrat',
      fontSize: 52,
      fontWeight: 800,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      strokeColor: '#000000',
      strokeWidth: 3,
      shadow: {
        x: 3,
        y: 3,
        blur: 8,
        color: 'rgba(0, 0, 0, 0.8)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 900,
      padding: 20
    },

    bold: {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 900,
      color: '#FFFF00',
      strokeColor: '#000000',
      strokeWidth: 6,
      shadow: {
        x: 4,
        y: 4,
        blur: 10,
        color: 'rgba(0, 0, 0, 1)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 950,
      padding: 15
    },

    minimal: {
      fontFamily: 'Helvetica',
      fontSize: 44,
      fontWeight: 600,
      color: '#FFFFFF',
      strokeWidth: 0,
      shadow: {
        x: 2,
        y: 2,
        blur: 6,
        color: 'rgba(0, 0, 0, 0.5)'
      },
      animation: 'word-by-word',
      position: 'center',
      maxWidth: 800,
      padding: 25
    },

    neon: {
      fontFamily: 'Arial Black',
      fontSize: 56,
      fontWeight: 900,
      color: '#00FFFF',
      strokeColor: '#FF00FF',
      strokeWidth: 4,
      shadow: {
        x: 0,
        y: 0,
        blur: 20,
        color: 'rgba(0, 255, 255, 0.8)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 900,
      padding: 20
    },

    retro: {
      fontFamily: 'Courier New',
      fontSize: 48,
      fontWeight: 700,
      color: '#FFD700',
      backgroundColor: 'rgba(139, 69, 19, 0.8)',
      strokeColor: '#8B4513',
      strokeWidth: 3,
      shadow: {
        x: 5,
        y: 5,
        blur: 0,
        color: 'rgba(0, 0, 0, 1)'
      },
      animation: 'letter-by-letter',
      position: 'center',
      maxWidth: 850,
      padding: 30
    },

    handwritten: {
      fontFamily: 'Comic Sans MS',
      fontSize: 50,
      fontWeight: 700,
      color: '#333333',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      strokeWidth: 0,
      shadow: {
        x: 2,
        y: 2,
        blur: 4,
        color: 'rgba(0, 0, 0, 0.3)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 880,
      padding: 25
    },

    comic: {
      fontFamily: 'Bangers',
      fontSize: 60,
      fontWeight: 800,
      color: '#FF0000',
      strokeColor: '#000000',
      strokeWidth: 5,
      shadow: {
        x: 3,
        y: 3,
        blur: 0,
        color: 'rgba(255, 255, 0, 1)'
      },
      animation: 'word-by-word',
      position: 'top',
      maxWidth: 920,
      padding: 15
    },

    elegant: {
      fontFamily: 'Playfair Display',
      fontSize: 46,
      fontWeight: 600,
      color: '#F5F5DC',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      strokeWidth: 0,
      shadow: {
        x: 2,
        y: 2,
        blur: 8,
        color: 'rgba(0, 0, 0, 0.7)'
      },
      animation: 'line-by-line',
      position: 'bottom',
      maxWidth: 850,
      padding: 30
    },

    grunge: {
      fontFamily: 'Impact',
      fontSize: 58,
      fontWeight: 900,
      color: '#CCCCCC',
      strokeColor: '#000000',
      strokeWidth: 4,
      shadow: {
        x: 6,
        y: 6,
        blur: 2,
        color: 'rgba(0, 0, 0, 0.9)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 900,
      padding: 18
    },

    kawaii: {
      fontFamily: 'Rounded Mplus 1c',
      fontSize: 54,
      fontWeight: 800,
      color: '#FF69B4',
      strokeColor: '#FFFFFF',
      strokeWidth: 5,
      shadow: {
        x: 3,
        y: 3,
        blur: 10,
        color: 'rgba(255, 192, 203, 0.8)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 880,
      padding: 22
    },

    'alex-hormozi': {
      fontFamily: 'Arial Black',
      fontSize: 72,
      fontWeight: 900,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      strokeColor: '#FFD700',
      strokeWidth: 4,
      shadow: {
        x: 4,
        y: 4,
        blur: 12,
        color: 'rgba(0, 0, 0, 1)'
      },
      animation: 'word-by-word',
      position: 'center',
      maxWidth: 950,
      padding: 25
    },

    'mr-beast': {
      fontFamily: 'Impact',
      fontSize: 68,
      fontWeight: 900,
      color: '#FFFF00',
      strokeColor: '#000000',
      strokeWidth: 8,
      shadow: {
        x: 5,
        y: 5,
        blur: 15,
        color: 'rgba(255, 0, 0, 0.6)'
      },
      animation: 'word-by-word',
      position: 'bottom',
      maxWidth: 940,
      padding: 20
    },

    vsauce: {
      fontFamily: 'Roboto',
      fontSize: 50,
      fontWeight: 700,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      strokeWidth: 0,
      shadow: {
        x: 3,
        y: 3,
        blur: 8,
        color: 'rgba(0, 0, 0, 0.8)'
      },
      animation: 'line-by-line',
      position: 'bottom',
      maxWidth: 870,
      padding: 28
    }
  }

  return styles[styleName] || styles.modern
}

/**
 * Get all available caption styles
 */
export function getAllCaptionStyles(): Array<{
  id: string
  name: string
  description: string
  preview: string
}> {
  return [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, professional captions with shadow',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-modern.png'
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'High-impact yellow text with thick stroke',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-bold.png'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, elegant white text',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-minimal.png'
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Cyberpunk-style glowing text',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-neon.png'
    },
    {
      id: 'retro',
      name: 'Retro',
      description: 'Vintage 80s-style captions',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-retro.png'
    },
    {
      id: 'handwritten',
      name: 'Handwritten',
      description: 'Casual, friendly handwritten style',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-handwritten.png'
    },
    {
      id: 'comic',
      name: 'Comic',
      description: 'Comic book-style action text',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-comic.png'
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated serif font',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-elegant.png'
    },
    {
      id: 'grunge',
      name: 'Grunge',
      description: 'Rough, edgy aesthetic',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-grunge.png'
    },
    {
      id: 'kawaii',
      name: 'Kawaii',
      description: 'Cute Japanese-inspired style',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-kawaii.png'
    },
    {
      id: 'alex-hormozi',
      name: 'Alex Hormozi',
      description: 'Bold, centered text like $100M offers',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-hormozi.png'
    },
    {
      id: 'mr-beast',
      name: 'MrBeast',
      description: 'Massive yellow impact text',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-mrbeast.png'
    },
    {
      id: 'vsauce',
      name: 'VSauce',
      description: 'Educational documentary style',
      preview: 'https://storage.viral-engine-pro.com/previews/caption-vsauce.png'
    }
  ]
}

/**
 * Generate custom caption style
 */
export function createCustomCaptionStyle(params: {
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  color?: string
  backgroundColor?: string
  strokeColor?: string
  strokeWidth?: number
  shadowX?: number
  shadowY?: number
  shadowBlur?: number
  shadowColor?: string
  animation?: 'word-by-word' | 'letter-by-letter' | 'line-by-line' | 'none'
  position?: 'top' | 'center' | 'bottom'
  maxWidth?: number
  padding?: number
}): CaptionStyle {
  return {
    fontFamily: params.fontFamily || 'Montserrat',
    fontSize: params.fontSize || 52,
    fontWeight: params.fontWeight || 800,
    color: params.color || '#FFFFFF',
    backgroundColor: params.backgroundColor,
    strokeColor: params.strokeColor,
    strokeWidth: params.strokeWidth || 0,
    shadow: params.shadowX !== undefined ? {
      x: params.shadowX,
      y: params.shadowY || 0,
      blur: params.shadowBlur || 0,
      color: params.shadowColor || 'rgba(0, 0, 0, 0.8)'
    } : undefined,
    animation: params.animation || 'word-by-word',
    position: params.position || 'bottom',
    maxWidth: params.maxWidth || 900,
    padding: params.padding || 20
  }
}
