'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, Zap, TrendingUp, Video, Upload, Wand2, 
  Play, Download, Share2, Eye, Clock, CheckCircle 
} from 'lucide-react'
import { viralTemplates } from '@/lib/templates/viral-templates-complete'

interface VideoGenerationState {
  step: number
  template?: any
  script?: string
  voiceType?: string
  platform?: string
  status?: 'idle' | 'generating' | 'complete' | 'error'
  progress?: number
  videoUrl?: string
}

export default function CreateVideoPage() {
  const [state, setState] = useState<VideoGenerationState>({ step: 1, status: 'idle', progress: 0 })
  const [customScript, setCustomScript] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'finance', 'personal-development', 'tech-ai', 'business', 'health', 'entertainment']
  
  const filteredTemplates = selectedCategory === 'all' 
    ? viralTemplates 
    : viralTemplates.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template: any) => {
    setState({ ...state, template, step: 2 })
  }

  const generateVideo = async () => {
    setState({ ...state, status: 'generating', progress: 0 })

    // Simulate video generation with progress
    const progressInterval = setInterval(() => {
      setState(prev => {
        const newProgress = Math.min((prev.progress || 0) + 10, 90)
        return { ...prev, progress: newProgress }
      })
    }, 500)

    try {
      // TODO: Call actual API
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: state.template?.id,
          script: customScript || state.template?.script,
          voice_type: state.voiceType || 'male-professional',
          platform: state.platform || 'tiktok'
        })
      })

      const data = await response.json()
      
      clearInterval(progressInterval)
      setState({ 
        ...state, 
        status: 'complete', 
        progress: 100, 
        videoUrl: data.video_url,
        step: 4 
      })
    } catch (error) {
      clearInterval(progressInterval)
      setState({ ...state, status: 'error', progress: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-10 h-10 text-pink-500" />
                Create Viral Video
              </h1>
              <p className="text-gray-400">Transform templates into viral content in minutes</p>
            </div>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Step {state.step} of 4
            </Badge>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <Progress value={(state.step / 4) * 100} className="mb-8 h-2" />

        {/* Step 1: Template Selection */}
        {state.step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-6 h-6 text-cyan-400" />
                  Choose Your Template
                </CardTitle>
                <CardDescription>
                  Select a proven viral template or start from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                      className="capitalize"
                    >
                      {cat.replace('-', ' ')}
                    </Button>
                  ))}
                </div>

                {/* Template Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.slice(0, 12).map(template => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(template)}
                      className="cursor-pointer"
                    >
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500 transition-colors h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge className="bg-gradient-to-r from-cyan-500 to-pink-500">
                              {template.viralScore}% Viral Score
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-white text-lg">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {template.hook}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            {template.length}
                            <Eye className="w-4 h-4 ml-2" />
                            {template.avgViews}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => setState({ ...state, step: 2, template: { custom: true } })}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Start From Scratch
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Script Customization */}
        {state.step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-pink-500" />
                  Customize Your Script
                </CardTitle>
                <CardDescription>
                  Edit the viral template or write your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Template Info */}
                {state.template && !state.template.custom && (
                  <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg p-4 border border-cyan-500/20">
                    <h3 className="text-white font-bold mb-2">{state.template.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{state.template.hook}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-cyan-500">
                        {state.template.viralScore}% Viral Score
                      </Badge>
                      <Badge variant="outline">{state.template.category}</Badge>
                    </div>
                  </div>
                )}

                {/* Script Editor */}
                <div>
                  <Label className="text-white mb-2 block">Video Script</Label>
                  <Textarea
                    placeholder="Write or paste your script here..."
                    value={customScript || state.template?.script || ''}
                    onChange={(e) => setCustomScript(e.target.value)}
                    rows={15}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Character count: {(customScript || state.template?.script || '').length}
                  </p>
                </div>

                {/* AI Script Generator */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Enhance Script
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Add Viral Hook
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setState({ ...state, step: 1 })}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-pink-500"
                    onClick={() => setState({ ...state, step: 3 })}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Video Settings */}
        {state.step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                  Video Settings
                </CardTitle>
                <CardDescription>
                  Configure voice, platform, and style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <Label className="text-white mb-3 block">Target Platform</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['tiktok', 'youtube-shorts', 'instagram-reels'].map(platform => (
                      <Button
                        key={platform}
                        variant={state.platform === platform ? 'default' : 'outline'}
                        onClick={() => setState({ ...state, platform })}
                        className="h-20 flex flex-col gap-1"
                      >
                        <Video className="w-6 h-6" />
                        <span className="capitalize text-sm">
                          {platform.replace('-', ' ')}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Voice Selection */}
                <div>
                  <Label className="text-white mb-2 block">Voice Type</Label>
                  <Select 
                    value={state.voiceType} 
                    onValueChange={(value) => setState({ ...state, voiceType: value })}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Select voice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male-professional">Male - Professional</SelectItem>
                      <SelectItem value="female-energetic">Female - Energetic</SelectItem>
                      <SelectItem value="male-deep">Male - Deep Voice</SelectItem>
                      <SelectItem value="female-calm">Female - Calm</SelectItem>
                      <SelectItem value="ai-narrator">AI Narrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Style */}
                <div>
                  <Label className="text-white mb-2 block">Background Style</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Dynamic Gradient', 'Gaming', 'Nature', 'Abstract'].map(style => (
                      <Button
                        key={style}
                        variant="outline"
                        className="h-16"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Caption Settings */}
                <Tabs defaultValue="style" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="style">Caption Style</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                  </TabsList>
                  <TabsContent value="style" className="space-y-3">
                    <Select defaultValue="bold">
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bold">Bold Impact</SelectItem>
                        <SelectItem value="minimal">Minimal Clean</SelectItem>
                        <SelectItem value="neon">Neon Glow</SelectItem>
                        <SelectItem value="classic">Classic Subtitle</SelectItem>
                      </SelectContent>
                    </Select>
                  </TabsContent>
                  <TabsContent value="effects" className="space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Zap className="w-3 h-3 mr-1" /> Zoom Effect
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Sparkles className="w-3 h-3 mr-1" /> Particle Burst
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setState({ ...state, step: 2 })}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-pink-500"
                    onClick={generateVideo}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Generation & Download */}
        {state.step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {state.status === 'generating' && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                      Generating Your Viral Video...
                    </>
                  )}
                  {state.status === 'complete' && (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Video Ready!
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {state.status === 'generating' && (
                  <>
                    <Progress value={state.progress} className="h-3" />
                    <p className="text-center text-gray-400">
                      {state.progress}% - Processing your video with AI...
                    </p>
                  </>
                )}

                {state.status === 'complete' && (
                  <>
                    {/* Video Preview */}
                    <div className="bg-black rounded-lg aspect-[9/16] max-w-md mx-auto relative overflow-hidden">
                      <video 
                        src={state.videoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share to Socials
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-cyan-400">
                          {state.template?.viralScore || 92}%
                        </p>
                        <p className="text-sm text-gray-400">Viral Score</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-pink-400">
                          {state.template?.avgViews || '500K+'}
                        </p>
                        <p className="text-sm text-gray-400">Est. Views</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-purple-400">
                          {state.template?.avgEngagement || '8.5%'}
                        </p>
                        <p className="text-sm text-gray-400">Engagement</p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setState({ step: 1, status: 'idle', progress: 0 })}
                    >
                      Create Another Video
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
