'use client'

// 🔥 VIRAL ENGINE PRO - ANALYTICS DASHBOARD
// Built: December 13, 2025 by RJ Business Solutions

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Eye, Heart, Share2, DollarSign, 
  Users, Video, Clock, Target, Zap,
  ArrowUp, ArrowDown, Play, Download
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'tiktok' | 'instagram' | 'youtube'>('all')

  // Mock data - will be replaced with real API calls
  const stats = {
    totalViews: 2847593,
    totalVideos: 127,
    avgEngagement: 8.4,
    totalRevenue: 12847,
    viewsChange: 23.5,
    videosChange: 12,
    engagementChange: -2.1,
    revenueChange: 45.2
  }

  const platformStats = [
    { platform: 'TikTok', icon: '🎵', views: 1247893, engagement: 9.2, videos: 68 },
    { platform: 'Instagram', icon: '📸', views: 892456, engagement: 7.8, videos: 42 },
    { platform: 'YouTube', icon: '▶️', views: 707244, engagement: 8.1, videos: 17 }
  ]

  const topVideos = [
    {
      id: '1',
      title: 'Credit Score Transformation in 30 Days',
      thumbnail: '/thumbnails/1.jpg',
      views: 384920,
      engagement: 12.4,
      platform: 'tiktok',
      revenue: 2840
    },
    {
      id: '2',
      title: '5AM Club Challenge Results',
      thumbnail: '/thumbnails/2.jpg',
      views: 298473,
      engagement: 11.2,
      platform: 'instagram',
      revenue: 1920
    },
    {
      id: '3',
      title: 'Side Hustle to $10K/Month',
      thumbnail: '/thumbnails/3.jpg',
      views: 247891,
      engagement: 10.8,
      platform: 'youtube',
      revenue: 3240
    }
  ]

  const recentActivity = [
    { action: 'Video Published', title: 'Debt Payoff Strategy', platform: 'tiktok', time: '2 hours ago' },
    { action: 'Milestone Reached', title: '100K Views on "Budget Hacks"', platform: 'instagram', time: '5 hours ago' },
    { action: 'Video Published', title: 'Passive Income Blueprint', platform: 'youtube', time: '8 hours ago' },
    { action: 'Viral Alert', title: 'Credit Card Approval Hack went viral!', platform: 'tiktok', time: '1 day ago' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-gray-400">
                Track your viral performance across all platforms
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex bg-gray-900 rounded-xl p-1 border border-purple-900/30">
                {(['7d', '30d', '90d', 'all'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === 'all' ? 'All Time' : range.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Eye}
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            change={stats.viewsChange}
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
          />
          <MetricCard
            icon={Video}
            label="Videos Published"
            value={stats.totalVideos.toString()}
            change={stats.videosChange}
            iconColor="text-purple-500"
            iconBg="bg-purple-500/10"
          />
          <MetricCard
            icon={Heart}
            label="Avg Engagement"
            value={`${stats.avgEngagement}%`}
            change={stats.engagementChange}
            iconColor="text-pink-500"
            iconBg="bg-pink-500/10"
          />
          <MetricCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            iconColor="text-green-500"
            iconBg="bg-green-500/10"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Performance */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-900/30">
              <h2 className="text-2xl font-bold text-white mb-6">Platform Performance</h2>
              
              <div className="space-y-4">
                {platformStats.map((platform, index) => (
                  <motion.div
                    key={platform.platform}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-950/50 rounded-xl p-6 border border-purple-900/20 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{platform.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{platform.platform}</h3>
                          <p className="text-sm text-gray-400">{platform.videos} videos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">
                          {(platform.views / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-400">views</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(platform.views / stats.totalViews) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {((platform.views / stats.totalViews) * 100).toFixed(1)}% of total views
                      </span>
                      <span className="text-green-400 font-semibold">
                        {platform.engagement}% engagement
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Performing Videos */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-900/30">
              <h2 className="text-2xl font-bold text-white mb-6">Top Performing Videos</h2>
              
              <div className="space-y-4">
                {topVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-950/50 rounded-xl p-4 border border-purple-900/20 hover:border-purple-500/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-32 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
                        <Play className="w-8 h-8 text-white opacity-80 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.platform === 'tiktok' ? '🎵' : video.platform === 'instagram' ? '📸' : '▶️'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-2 group-hover:text-purple-400 transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{(video.views / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>{video.engagement}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <DollarSign className="w-4 h-4" />
                            <span>${video.revenue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rank Badge */}
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-black text-lg
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                          'bg-gradient-to-br from-orange-600 to-red-600 text-white'}
                      `}>
                        #{index + 1}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Insights */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-900/30">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 pb-4 border-b border-gray-800 last:border-0"
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${activity.action === 'Viral Alert' ? 'bg-yellow-500/20 text-yellow-500' :
                        activity.action === 'Milestone Reached' ? 'bg-green-500/20 text-green-500' :
                        'bg-blue-500/20 text-blue-500'}
                    `}>
                      {activity.action === 'Viral Alert' ? '🔥' :
                       activity.action === 'Milestone Reached' ? '🎯' : '📤'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white mb-1">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-400 mb-1">
                        {activity.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{activity.platform === 'tiktok' ? '🎵 TikTok' : activity.platform === 'instagram' ? '📸 Instagram' : '▶️ YouTube'}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/50">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Quick Insights</h2>
              </div>
              
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-sm text-purple-300 mb-1">🔥 Trending Template</div>
                  <div className="text-white font-semibold">Credit Score Transformation</div>
                  <div className="text-xs text-gray-400 mt-1">Used in 23 viral videos</div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-sm text-purple-300 mb-1">⏰ Best Posting Time</div>
                  <div className="text-white font-semibold">6:00 PM - 9:00 PM EST</div>
                  <div className="text-xs text-gray-400 mt-1">32% higher engagement</div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-sm text-purple-300 mb-1">🎯 Top Performing Category</div>
                  <div className="text-white font-semibold">Finance & Money</div>
                  <div className="text-xs text-gray-400 mt-1">Avg. 384K views per video</div>
                </div>
              </div>
            </div>

            {/* Growth Tip */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/50">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Growth Tip</h2>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Your finance content performs 3x better on TikTok. Consider cross-posting your top performers to Instagram Reels for additional reach!
              </p>

              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full">
                Create Cross-Post Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  change,
  iconColor,
  iconBg
}: { 
  icon: any
  label: string
  value: string
  change: number
  iconColor: string
  iconBg: string
}) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="text-3xl font-black text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-400">
        {label}
      </div>
    </motion.div>
  )
}
