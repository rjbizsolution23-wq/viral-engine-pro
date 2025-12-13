/**
 * 🎯 LANDING PAGE - VIRAL ENGINE PRO
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, TrendingUp, Users, Crown, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-black text-white">Viral Engine Pro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
            <Link href="#templates" className="text-gray-300 hover:text-white transition">Templates</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full"
            >
              <span className="text-purple-300 font-semibold">🔥 150+ Viral Templates Included</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Create Viral Videos in
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Minutes</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              AI-powered video generation with 150+ done-for-you templates. 
              Turn any idea into viral TikToks, Reels, and Shorts—automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-6 text-lg group">
                  Start Creating Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg group">
                <Play className="mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-black text-white">10M+</div>
                <div className="text-gray-400">Videos Created</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">150+</div>
                <div className="text-gray-400">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">4.9/5</div>
                <div className="text-gray-400">User Rating</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">50K+</div>
                <div className="text-gray-400">Creators</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Demo Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <Play className="w-24 h-24 text-white opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Everything You Need to Go Viral
            </h2>
            <p className="text-xl text-gray-400">
              Professional features that would cost thousands—included for free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI Script Generation',
                description: 'Proven viral hooks and scripts written by AI trained on millions of viral videos'
              },
              {
                icon: TrendingUp,
                title: '150+ Templates',
                description: 'Done-for-you templates for every niche—business, fitness, motivation, money, and more'
              },
              {
                icon: Users,
                title: 'Auto-Posting',
                description: 'Schedule and auto-post to TikTok, Instagram, and YouTube—all from one dashboard'
              },
              {
                icon: Crown,
                title: 'White-Label Ready',
                description: 'Rebrand and resell as your own. Perfect for agencies and entrepreneurs'
              },
              {
                icon: CheckCircle,
                title: 'Unlimited Exports',
                description: 'No limits. Export as many videos as you want in 4K quality'
              },
              {
                icon: Star,
                title: 'Bulk Generation',
                description: 'Generate 50+ videos at once. Scale your content creation effortlessly'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
              >
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Choose the plan that fits your needs. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 29,
                period: 'month',
                features: [
                  '50 videos/month',
                  'All 150 templates',
                  'AI script generation',
                  '1080p exports',
                  'Basic analytics',
                  'Email support'
                ],
                cta: 'Start Free Trial',
                popular: false
              },
              {
                name: 'Pro',
                price: 79,
                period: 'month',
                features: [
                  'Unlimited videos',
                  'All 150 templates',
                  'AI script generation',
                  '4K exports',
                  'Auto-posting (TikTok, IG, YT)',
                  'Advanced analytics',
                  'White-label option',
                  'Priority support',
                  'Bulk generation (50+ videos)'
                ],
                cta: 'Start Free Trial',
                popular: true
              },
              {
                name: 'Agency',
                price: 199,
                period: 'month',
                features: [
                  'Everything in Pro',
                  'Unlimited team members',
                  'Custom templates',
                  'API access',
                  'Dedicated account manager',
                  'Custom integrations',
                  'White-label reseller rights'
                ],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-900/50 border-2 rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-purple-500 scale-105 shadow-2xl shadow-purple-500/20' 
                    : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard">
                  <Button 
                    className={`w-full py-6 text-lg font-bold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image 
                src="https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg"
                alt="RJ Business Solutions"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <div className="text-white font-bold">RJ Business Solutions</div>
                <div className="text-gray-400 text-sm">1342 NM 333, Tijeras, NM 87059</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 RJ Business Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
