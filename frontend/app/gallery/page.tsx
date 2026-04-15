'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore, VideoJob } from '@/lib/store'
import { Search, Download, Play, Calendar, Clock, Film } from 'lucide-react'
import Link from 'next/link'

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')
  const { jobs } = useAppStore()

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'processing': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">Video Gallery</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline">Sign Out</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'completed', 'processing', 'failed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'gradient' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start creating your first video'
              }
            </p>
            <Link href="/dashboard">
              <Button variant="gradient">Create Video</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden border border-white/10 group hover:border-purple-500/30 transition-all"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                  {job.status === 'completed' && job.videoUrl ? (
                    <video
                      className="w-full h-full object-cover"
                      src={job.videoUrl}
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Film className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  {job.status === 'completed' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="gradient" className="rounded-full">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-2">
                    {job.prompt}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.duration}s</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {job.status === 'completed' && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {job.status === 'processing' && (
                      <Button size="sm" variant="outline" disabled className="flex-1">
                        Processing...
                      </Button>
                    )}
                    {job.status === 'failed' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
