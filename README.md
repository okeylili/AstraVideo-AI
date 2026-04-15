# AstraVideo AI - Text-to-Video Generation Platform

A production-grade full-stack AI SaaS platform that transforms text into stunning videos using advanced diffusion models with an async GPU worker architecture.

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **ShadCN UI** for components
- **Lucide React** for icons

### Backend
- **FastAPI** (Python)
- **Redis** for job queue and caching
- **Celery** for async task processing
- **SQLite/Redis** for job storage

### AI/ML
- **ModelScope** text-to-video synthesis (damo/text-to-video-synthesis)
- **PyTorch** for model inference
- **FFmpeg** for video processing

## Architecture

```
AstraVideo AI/
/frontend          # Next.js frontend application
/backend           # FastAPI REST API
/worker           # Celery worker for video processing
/outputs           # Generated video storage
```

## Features

### Frontend
- Modern SaaS UI with glassmorphism design
- Animated hero section and landing page
- Dashboard with prompt input and advanced controls
- Style selector (cinematic, anime, realistic, 3D render)
- Duration slider (5-30 seconds)
- FPS slider (8-24)
- Seed input for reproducibility
- Job status page with real-time polling
- Gallery page for generated videos
- Theme system (dark, light, neon, glassmorphism)
- Responsive design

### Backend
- RESTful API with FastAPI
- Async job processing with Celery
- Redis for job queue and storage
- JWT authentication (basic implementation)
- Rate limiting per user
- Video generation with ModelScope
- FFmpeg video processing

### Worker
- GPU-accelerated video generation
- Prompt enhancement with style templates
- Frame generation and MP4 conversion
- Error handling and fallback demo videos
- Progress tracking and status updates

## Quick Start

### Prerequisites

1. **Node.js 18+** and **npm** or **yarn**
2. **Python 3.9+** with **pip**
3. **Redis Server**
4. **FFmpeg** (for video processing)
5. **CUDA-compatible GPU** (optional, for ModelScope)

### Installation

#### 1. Clone and Setup Project Structure

```bash
git clone <repository-url>
cd AstraVideo AI
```

#### 2. Install Redis

**Windows:**
```bash
# Using WSL or Docker
docker run -d -p 6379:6379 redis:latest
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

#### 3. Install FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

#### 4. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 5. Setup Worker

```bash
cd worker

# Create virtual environment (if not using backend's)
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 6. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Running the Application

#### 1. Start Redis Server

```bash
redis-server
```

#### 2. Start Backend API

```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Start FastAPI server
python main.py
```

The API will be available at `http://localhost:8000`

#### 3. Start Celery Worker

Open a new terminal:

```bash
cd worker
# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Start Celery worker
celery -A video_processor worker --loglevel=info
```

#### 4. Start Frontend

Open a new terminal:

```bash
cd frontend

# Start development server
npm run dev

# Or with yarn
yarn dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Generate Video
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "style": "cinematic",
  "duration": 10,
  "fps": 16,
  "seed": 42,
  "user_id": "user123"
}
```

### Get Job Status
```http
GET /api/status/{job_id}
```

### Get User History
```http
GET /api/history/{user_id}?limit=50
```

### Health Check
```http
GET /api/health
```

## Frontend Pages

### Landing Page (`/`)
- Hero section with animated gradients
- Feature showcase
- Call-to-action buttons

### Dashboard (`/dashboard`)
- Prompt input with history
- Style selector
- Advanced controls (duration, FPS, seed)
- Current job status
- Recent jobs sidebar

### Gallery (`/gallery`)
- Video grid with thumbnails
- Search and filtering
- Status indicators
- Download and play actions

## Configuration

### Environment Variables

**Backend (.env):**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
CELERY_BROKER=redis://localhost:6379/1
CELERY_BACKEND=redis://localhost:6379/2
JWT_SECRET_KEY=your-secret-key
OUTPUTS_DIR=../outputs
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Video Generation Process

1. **User submits prompt** via frontend dashboard
2. **Backend creates job** and stores in Redis
3. **Celery queues task** for processing
4. **Worker enhances prompt** with style template
5. **ModelScope generates** video frames
6. **FFmpeg converts** frames to MP4
7. **Video saved** to outputs directory
8. **Status updated** to completed
9. **Frontend polls** for status updates

## Troubleshooting

### Common Issues

#### 1. Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

#### 2. FFmpeg Not Found
```bash
# Check FFmpeg installation
ffmpeg -version

# Add to PATH if not found
```

#### 3. ModelScope Download Issues
- The worker includes fallback demo video generation
- Check internet connection for model downloads
- Ensure sufficient disk space (~2GB for models)

#### 4. CUDA/GPU Issues
- The system works with CPU but is slower
- Install PyTorch with CUDA support:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### 5. Port Conflicts
- Change ports in configuration if 3000/8000/6379 are occupied
- Update frontend `next.config.js` for API proxy

### Development Tips

#### 1. Testing Without GPU
The worker automatically creates demo videos when ModelScope fails, allowing testing without GPU.

#### 2. Monitoring Redis
```bash
# Monitor Redis in real-time
redis-cli monitor

# Check job storage
redis-cli keys "job:*"
redis-cli get "job:job_id"
```

#### 3. Celery Worker Status
```bash
# Check active workers
celery -A video_processor inspect active

# Monitor tasks
celery -A video_processor events
```

## Production Deployment

### Docker Setup (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis

  worker:
    build: ./worker
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Scaling Considerations

1. **Multiple Workers**: Scale Celery workers horizontally
2. **Redis Cluster**: Use Redis Cluster for high availability
3. **Load Balancer**: Add nginx for API load balancing
4. **CDN**: Use CDN for video file serving
5. **Database**: Consider PostgreSQL for production

## Security Notes

1. **Input Validation**: Sanitize all user prompts
2. **Rate Limiting**: Implement per-user rate limits
3. **File Upload**: Secure video file serving
4. **Authentication**: Strengthen JWT implementation
5. **CORS**: Configure proper CORS policies

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check troubleshooting section
- Review logs for error messages
- Create GitHub issue with details

---

**Note**: This is a demonstration project. For production use, implement additional security measures, error handling, and monitoring.
