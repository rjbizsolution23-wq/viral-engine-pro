'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, Check, Zap, Crown, Star, TrendingUp, 
  Download, Clock, Shield, ArrowRight, Gift, Sparkles 
} from 'lucide-react'

interface SubscriptionTier {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  videosPerMonth: number
  storageGB: number
  priority: string
  popular?: boolean
  icon: any
  gradient: string
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for testing the waters',
    features: [
      '5 videos per month',
      '720p quality',
      '2GB storage',
      'Basic templates',
      'Community support'
    ],
    videosPerMonth: 5,
    storageGB: 2,
    priority: 'Standard',
    icon: Star,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For serious content creators',
    features: [
      '100 videos per month',
      '1080p quality',
      '50GB storage',
      'All 150+ templates',
      'Priority support',
      'Batch generation',
      'Custom branding',
      'Advanced analytics'
    ],
    videosPerMonth: 100,
    storageGB: 50,
    priority: 'High',
    popular: true,
    icon: Zap,
    gradient: 'from-cyan-500 to-pink-500'
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    period: 'month',
    description: 'For agencies and teams',
    features: [
      '500 videos per month',
      '4K quality',
      '200GB storage',
      'All features',
      'Priority support 24/7',
      'Team collaboration (5 seats)',
      'White-label option',
      'API access',
      'Custom integrations'
    ],
    videosPerMonth: 500,
    storageGB: 200,
    priority: 'Highest',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    period: 'month',
    description: 'Custom solutions for scale',
    features: [
      'Unlimited videos',
      '8K quality',
      '1TB storage',
      'Dedicated account manager',
      'Custom AI model training',
      'Unlimited team seats',
      'On-premise deployment option',
      'SLA guarantee',
      'Custom contract terms'
    ],
    videosPerMonth: -1, // unlimited
    storageGB: 1000,
    priority: 'VIP',
    icon: Crown,
    gradient: 'from-yellow-500 to-orange-500'
  }
]

export default function BillingPage() {
  const [currentPlan] = useState('free')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [videosUsed] = useState(3)
  const [storageUsed] = useState(1.2)

  const currentTier = subscriptionTiers.find(t => t.id === currentPlan)!

  const handleCheckout = async (tierId: string) => {
    // TODO: Stripe integration
    console.log('Checkout for:', tierId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-pink-500" />
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Choose the perfect plan for your viral video empire
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-900/50 p-2 rounded-full">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('monthly')}
              className="rounded-full"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('annual')}
              className="rounded-full"
            >
              Annual
              <Badge className="ml-2 bg-green-500">Save 20%</Badge>
            </Button>
          </div>
        </motion.div>

        {/* Current Usage (if subscribed) */}
        {currentPlan !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  Current Usage - {currentTier.name} Plan
                </CardTitle>
                <CardDescription>Your usage this billing period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Videos */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Videos Generated</span>
                      <span className="text-white font-bold">
                        {videosUsed} / {currentTier.videosPerMonth === -1 ? '∞' : currentTier.videosPerMonth}
                      </span>
                    </div>
                    <Progress 
                      value={(videosUsed / currentTier.videosPerMonth) * 100} 
                      className="h-3"
                    />
                  </div>

                  {/* Storage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Storage Used</span>
                      <span className="text-white font-bold">
                        {storageUsed}GB / {currentTier.storageGB}GB
                      </span>
                    </div>
                    <Progress 
                      value={(storageUsed / currentTier.storageGB) * 100} 
                      className="h-3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subscriptionTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={tier.popular ? 'lg:scale-105' : ''}
            >
              <Card className={`bg-gray-900/50 border-2 backdrop-blur-xl h-full flex flex-col ${
                tier.popular ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20' : 'border-gray-800'
              } ${currentPlan === tier.id ? 'ring-4 ring-green-500' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-pink-500 px-4 py-1">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      MOST POPULAR
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center mb-4`}>
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                  
                  <div className="mt-4">
                    {tier.price === 0 ? (
                      <div className="text-4xl font-black text-white">Free</div>
                    ) : (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-5xl font-black text-white">
                            ${billingPeriod === 'annual' ? Math.floor(tier.price * 0.8) : tier.price}
                          </span>
                          <span className="text-gray-400 ml-2">/{tier.period}</span>
                        </div>
                        {billingPeriod === 'annual' && (
                          <p className="text-sm text-green-400 mt-1">
                            Save ${tier.price * 12 * 0.2}/year
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {currentPlan === tier.id ? (
                    <Button className="w-full" variant="outline" disabled>
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handleCheckout(tier.id)}
                    >
                      {tier.price === 0 ? 'Get Started' : 'Upgrade Now'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ / Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-center">What's Included?</CardTitle>
              <CardDescription className="text-center">
                Compare features across all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Secure & Reliable</h3>
                  <p className="text-gray-400 text-sm">
                    Enterprise-grade security with 99.9% uptime guarantee
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Lightning Fast</h3>
                  <p className="text-gray-400 text-sm">
                    Generate viral videos in under 2 minutes with GPU acceleration
                  </p>
                </div>
                <div className="text-center">
                  <Download className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Unlimited Downloads</h3>
                  <p className="text-gray-400 text-sm">
                    Download your videos unlimited times in any format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Need a custom plan? <a href="#" className="text-cyan-400 hover:underline">Contact sales</a>
          </p>
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Gift className="w-5 h-5" />
            <span className="font-bold">7-day money-back guarantee on all paid plans</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
