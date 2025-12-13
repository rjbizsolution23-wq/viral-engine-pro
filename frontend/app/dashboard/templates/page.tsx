'use client'

// 🔥 VIRAL ENGINE PRO - TEMPLATE LIBRARY PAGE
// Built: December 13, 2025 by RJ Business Solutions

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, TrendingUp, Play, Star, Eye, 
  Target, Zap, Crown, CheckCircle, ArrowRight 
} from 'lucide-react'
import { ALL_VIRAL_TEMPLATES, TEMPLATE_STATS, type ViralTemplate } from '@/lib/templates/viral-templates-complete'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'viralScore' | 'name'>('viralScore')

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let results = ALL_VIRAL_TEMPLATES

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.hook.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      results = results.filter(t => t.category === selectedCategory)
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      results = results.filter(t => t.platform.includes(selectedPlatform as any))
    }

    // Sort
    results.sort((a, b) => {
      if (sortBy === 'viralScore') {
        return b.viralScore - a.viralScore
      }
      return a.name.localeCompare(b.name)
    })

    return results
  }, [searchQuery, selectedCategory, selectedPlatform, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                🔥 Viral Templates
              </h1>
              <p className="text-gray-400">
                {TEMPLATE_STATS.totalTemplates} proven templates • Average {TEMPLATE_STATS.averageViralScore.toFixed(1)} viral score
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">
                  {filteredTemplates.length}
                </div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-purple-900/30">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search templates, hooks, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950 border border-purple-900/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-950 border border-purple-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {TEMPLATE_STATS.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full bg-gray-950 border border-purple-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-400">Sort by:</span>
            <button
              onClick={() => setSortBy('viralScore')}
              className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'viralScore'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Viral Score
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'name'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              A-Z
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedPlatform}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No templates found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedPlatform('all')
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function TemplateCard({ template, index }: { template: ViralTemplate; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-purple-400 bg-purple-950/50 px-2 py-1 rounded">
              {template.category}
            </span>
            {template.viralScore >= 90 && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
            {template.name}
          </h3>
        </div>

        {/* Viral Score Badge */}
        <div className="relative">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${template.viralScore >= 90 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 
                template.viralScore >= 80 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                'bg-gradient-to-br from-blue-500 to-cyan-500'}
            `}
          >
            <div className="text-center">
              <div className="text-2xl font-black text-white">
                {template.viralScore}
              </div>
              <div className="text-[8px] text-white/80 font-bold">
                VIRAL
              </div>
            </div>
          </motion.div>
          {template.viralScore >= 95 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Hook Preview */}
      <div className="bg-gray-950/50 rounded-xl p-4 mb-4 border border-purple-900/20">
        <p className="text-sm text-purple-300 font-medium mb-1">Hook:</p>
        <p className="text-white font-bold text-base leading-snug">
          "{template.hook}"
        </p>
      </div>

      {/* Platforms */}
      <div className="flex items-center gap-2 mb-4">
        {template.platform.map(platform => (
          <span
            key={platform}
            className="text-xs bg-gray-950 text-gray-400 px-2 py-1 rounded border border-gray-800"
          >
            {platform === 'tiktok' ? '🎵 TikTok' :
             platform === 'instagram' ? '📸 Instagram' :
             '▶️ YouTube'}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-950/50 rounded-lg p-3 border border-purple-900/20">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Est. Views</span>
          </div>
          <div className="text-sm font-bold text-white">
            {(template.estimatedViews.min / 1000).toFixed(0)}K - {(template.estimatedViews.max / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-gray-950/50 rounded-lg p-3 border border-purple-900/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Pacing</span>
          </div>
          <div className="text-sm font-bold text-white capitalize">
            {template.pacing}
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">Target Audience</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {template.targetAudience.slice(0, 3).map(audience => (
            <span
              key={audience}
              className="text-xs bg-cyan-950/30 text-cyan-300 px-2 py-1 rounded border border-cyan-900/30"
            >
              {audience}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Use This Template
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none rounded-2xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
