'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Play } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.purple.500/0.3),transparent_50%)]" />
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold gradient-text">AstraVideo AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Features
            </Button>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Gallery
            </Button>
            <Link href="/dashboard">
              <Button variant="gradient" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Powered by Advanced AI</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Transform Text</span>
              <br />
              <span className="text-foreground">Into Video</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create stunning, professional videos from simple text descriptions. 
              Our AI understands your vision and brings it to life in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" variant="gradient" className="text-lg px-8 py-3 group">
                  <Play className="mr-2 h-5 w-5" />
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-purple-500/50 hover:bg-purple-500/10">
                View Examples
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl border border-white/10"
            >
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                State-of-the-art diffusion models create realistic videos from your text prompts
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl border border-white/10"
            >
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate high-quality videos in seconds with our optimized GPU infrastructure
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl border border-white/10"
            >
              <div className="h-12 w-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Styles</h3>
              <p className="text-muted-foreground">
                Choose from cinematic, anime, realistic, and 3D render styles
              </p>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
