import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'neon' | 'glassmorphism'

export interface VideoJob {
  id: string
  prompt: string
  style: string
  duration: number
  fps: number
  seed?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  createdAt: Date
  userId: string
}

interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void
  jobs: VideoJob[]
  addJob: (job: VideoJob) => void
  updateJob: (id: string, updates: Partial<VideoJob>) => void
  currentJob: VideoJob | null
  setCurrentJob: (job: VideoJob | null) => void
  promptHistory: string[]
  addToHistory: (prompt: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => {
    set({ theme })
    localStorage.setItem('theme', theme)
    document.documentElement.className = theme
  },
  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (id, updates) => 
    set((state) => ({
      jobs: state.jobs.map(job => 
        job.id === id ? { ...job, ...updates } : job
      )
    })),
  currentJob: null,
  setCurrentJob: (job) => set({ currentJob: job }),
  promptHistory: [],
  addToHistory: (prompt) => 
    set((state) => ({
      promptHistory: [prompt, ...state.promptHistory.filter(p => p !== prompt)].slice(0, 10)
    })),
}))
