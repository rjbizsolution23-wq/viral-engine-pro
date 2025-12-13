/**
 * 🎯 VIDEO CREATION PAGE - VIRAL ENGINE PRO
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wand2, Download, Share2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ALL_TEMPLATES, getTemplatesByCategory } from '@/lib/templates/all-templates'

export default function CreateVideoPage() {
  const [step, setStep] = useState<'template' | 'customize' | 'generate' | 'preview'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [category, setCategory] = useState<string>('all')
  const [generating, setGenerating] = useState(false)

  const filteredTemplates = category === 'all' 
    ? ALL_TEMPLATES 
    : getTemplatesByCategory(category)

  const handleGenerate = async () => {
    setGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    setGenerating(false)
    setStep('preview')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white">Create Viral Video</h1>
              <p className="text-gray-400">Choose a template and customize your content</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {step === 'preview' && (
              <>
                <Button variant="outline" className="border-gray-700">
                  <Eye className="mr-2 w-4 h-4" />
                  Preview
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <Download className="mr-2 w-4 h-4" />
                  Download
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Share2 className="mr-2 w-4 h-4" />
                  Publish
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['template', 'customize', 'generate', 'preview'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s 
                    ? 'bg-purple-600 text-white' 
                    : ['template', 'customize', 'generate'].indexOf(step) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 ${
                    ['template', 'customize', 'generate'].indexOf(step) > index
                      ? 'bg-green-600'
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Choose a Template</CardTitle>
                <CardDescription>Select from 150+ proven viral templates</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-white mb-2">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="money">Wealth & Money</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="selfImprovement">Self-Improvement</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="tech">Tech & AI</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {filteredTemplates.slice(0, 9).map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.05 }}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-purple-400 uppercase">
                          {template.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 text-xs">⚡</span>
                          <span className="text-white text-xs font-bold">{template.viralScore}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.duration}s • {template.targetPlatforms.join(', ')}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    disabled={!selectedTemplate}
                    onClick={() => setStep('customize')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Continue to Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Customize */}
        {step === 'customize' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Content Settings</CardTitle>
                  <CardDescription>Customize your video content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Topic/Idea (Optional)</Label>
                    <Input 
                      placeholder="e.g., How to make passive income" 
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Target Audience</Label>
                    <Select defaultValue="general">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                        <SelectItem value="students">Students</SelectItem>
                        <SelectItem value="professionals">Professionals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Tone/Style</Label>
                    <Select defaultValue="motivational">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="entertaining">Entertaining</SelectItem>
                        <SelectItem value="inspiring">Inspiring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Custom Script (Optional)</Label>
                    <Textarea 
                      placeholder="Leave blank for AI-generated script"
                      rows={6}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Visual Settings</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Video Duration</Label>
                    <Select defaultValue="45">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="45">45 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Caption Style</Label>
                    <Select defaultValue="default">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (Word Pop)</SelectItem>
                        <SelectItem value="typewriter">Typewriter</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                        <SelectItem value="fade">Fade In</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Music Style</Label>
                    <Select defaultValue="epic">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="epic">Epic Motivational</SelectItem>
                        <SelectItem value="upbeat">Upbeat Inspiring</SelectItem>
                        <SelectItem value="dramatic">Dramatic Emotional</SelectItem>
                        <SelectItem value="chill">Chill Beats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Platform</Label>
                    <Select defaultValue="tiktok">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiktok">TikTok (9:16)</SelectItem>
                        <SelectItem value="instagram">Instagram Reels (9:16)</SelectItem>
                        <SelectItem value="youtube">YouTube Shorts (9:16)</SelectItem>
                        <SelectItem value="all">All Platforms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep('template')}>
                Back
              </Button>
              <Button 
                onClick={() => setStep('generate')}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Continue to Generate
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generate */}
        {step === 'generate' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <Card className="bg-gray-900/50 border-gray-800 w-full max-w-2xl">
              <CardContent className="p-12 text-center">
                {!generating ? (
                  <>
                    <Wand2 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Generate</h2>
                    <p className="text-gray-400 mb-8">
                      Your video will be generated using AI. This usually takes 30-60 seconds.
                    </p>
                    <Button 
                      size="lg"
                      onClick={handleGenerate}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Wand2 className="mr-2" />
                      Generate Video
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-4">Generating Your Video...</h2>
                    <p className="text-gray-400 mb-4">
                      AI is creating your viral masterpiece. Hang tight!
                    </p>
                    <div className="space-y-2 text-left max-w-md mx-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400">✓ Script generated</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400">✓ Visuals rendered</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-400">⏳ Adding captions...</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-600">⏳ Finalizing video...</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Preview */}
        {step === 'preview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
                        <p className="text-white opacity-50">Video Preview</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Video Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-semibold">45 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resolution:</span>
                      <span className="text-white font-semibold">1080x1920</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span className="text-white font-semibold">MP4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Size:</span>
                      <span className="text-white font-semibold">12.4 MB</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Download className="mr-2 w-4 h-4" />
                      Download HD
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700">
                      <Share2 className="mr-2 w-4 h-4" />
                      Schedule Post
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700">
                      Generate Another
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
