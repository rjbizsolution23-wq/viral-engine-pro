/**
 * 🎯 DASHBOARD - VIRAL ENGINE PRO
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Video, Calendar, Settings, LogOut, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Zap className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-black text-white">Viral Engine Pro</span>
        </div>

        <nav className="space-y-2">
          <Button 
            variant={selectedTab === 'overview' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setSelectedTab('overview')}
          >
            <TrendingUp className="mr-2 w-4 h-4" />
            Overview
          </Button>
          <Link href="/dashboard/create">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 w-4 h-4" />
              Create Video
            </Button>
          </Link>
          <Button 
            variant={selectedTab === 'videos' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setSelectedTab('videos')}
          >
            <Video className="mr-2 w-4 h-4" />
            My Videos
          </Button>
          <Button 
            variant={selectedTab === 'schedule' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setSelectedTab('schedule')}
          >
            <Calendar className="mr-2 w-4 h-4" />
            Schedule
          </Button>
          <Button 
            variant={selectedTab === 'settings' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setSelectedTab('settings')}
          >
            <Settings className="mr-2 w-4 h-4" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300">
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Welcome back, Rick! 👋</h1>
            <p className="text-gray-400">Here's what's happening with your videos today</p>
          </div>

          {selectedTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Videos Created', value: '127', change: '+12%', color: 'purple' },
                  { label: 'Total Views', value: '1.2M', change: '+24%', color: 'blue' },
                  { label: 'Engagement Rate', value: '8.4%', change: '+3.2%', color: 'green' },
                  { label: 'Viral Videos', value: '23', change: '+5', color: 'pink' }
                ].map((stat, index) => (
                  <Card key={index} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                        <div className={`text-${stat.color}-400 text-sm font-semibold`}>{stat.change}</div>
                      </div>
                      <div className="text-3xl font-black text-white">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="bg-gray-900/50 border-gray-800 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription>Get started with your next viral video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link href="/dashboard/create">
                      <Button className="w-full h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="mr-2" />
                        Create New Video
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-20 border-gray-700">
                      <TrendingUp className="mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full h-20 border-gray-700">
                      <Calendar className="mr-2" />
                      Schedule Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Videos */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Videos</CardTitle>
                  <CardDescription>Your latest creations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: '7-Figure Mindset Shift', views: '45.2K', date: '2 hours ago', status: 'Published' },
                      { title: 'Passive Income Blueprint', views: '38.1K', date: '5 hours ago', status: 'Published' },
                      { title: 'Morning Routine Secrets', views: '52.8K', date: '1 day ago', status: 'Published' }
                    ].map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
                          <div>
                            <div className="text-white font-semibold">{video.title}</div>
                            <div className="text-gray-400 text-sm">{video.views} views • {video.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {video.status}
                          </span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">All Videos</CardTitle>
                  <CardDescription>Manage your video library</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Video library interface coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Content Schedule</CardTitle>
                  <CardDescription>Plan and schedule your posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Scheduling interface coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Settings</CardTitle>
                  <CardDescription>Manage your account and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Settings interface coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
