'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore, VideoJob } from '@/lib/store'
import { Sparkles, Settings, Play, Download, History } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [duration, setDuration] = useState([10])
  const [fps, setFps] = useState([16])
  const [seed, setSeed] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { addJob, jobs, promptHistory, addToHistory, currentJob, setCurrentJob } = useAppStore()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    addToHistory(prompt)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          duration: duration[0],
          fps: fps[0],
          seed: seed ? parseInt(seed) : undefined,
          user_id: "default_user"
        })
      })

      const job = await response.json()
      addJob(job)
      setCurrentJob(job)
    } catch (error) {
      console.error('Failed to generate video:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const recentJobs = jobs.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">AstraVideo AI</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/gallery">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>Gallery</span>
                </Button>
              </Link>
              <Button variant="outline">Sign Out</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Generation Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text">Create Your Video</h2>
              
              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your video scene..."
                  className="w-full h-32 px-4 py-3 bg-background/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {promptHistory.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Recent prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {promptHistory.slice(0, 3).map((historyPrompt, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrompt(historyPrompt)}
                          className="text-xs h-6"
                        >
                          {historyPrompt.substring(0, 30)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Style Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="3d-render">3D Render</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Controls */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Advanced Controls</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Duration Slider */}
                  <div>
                    <label className="block text-sm mb-2">
                      Duration: {duration[0]}s
                    </label>
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      max={30}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* FPS Slider */}
                  <div>
                    <label className="block text-sm mb-2">
                      FPS: {fps[0]}
                    </label>
                    <Slider
                      value={fps}
                      onValueChange={setFps}
                      max={24}
                      min={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Seed Input */}
                <div className="mt-4">
                  <label className="block text-sm mb-2">Seed (optional)</label>
                  <Input
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Random seed for reproducibility"
                    type="number"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                variant="gradient"
                className="w-full text-lg py-3"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Generating...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Generate Video</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Job Status */}
            {currentJob && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold mb-4">Current Job</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{currentJob.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job ID</p>
                    <p className="font-mono text-xs">{currentJob.id}</p>
                  </div>
                  {currentJob.status === 'completed' && (
                    <Button variant="gradient" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recent Jobs */}
            {recentJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-background/30 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">
                          {job.prompt.substring(0, 20)}...
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {job.status}
                        </p>
                      </div>
                      {job.status === 'completed' && (
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Link href="/gallery">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
