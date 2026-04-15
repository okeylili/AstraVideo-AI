# Step-by-Step Setup Guide for AstraVideo AI

Follow these instructions exactly to get the platform running locally.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed  
- [ ] Redis Server installed
- [ ] FFmpeg installed
- [ ] Git installed

---

## Step 1: Install Redis Server

### Windows (Recommended: WSL2 + Docker)
```bash
# Install Docker Desktop first
# Then run Redis container
docker run -d -p 6379:6379 --name redis redis:latest

# Verify it's running
docker ps
```

### macOS
```bash
brew install redis
brew services start redis

# Verify
redis-cli ping
# Should return: PONG
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Verify
redis-cli ping
```

---

## Step 2: Install FFmpeg

### Windows
```bash
# Using Chocolatey (recommended)
choco install ffmpeg

# OR download from https://ffmpeg.org/download.html
# Add to PATH: C:\Program Files\ffmpeg\bin
```

### macOS
```bash
brew install ffmpeg

# Verify
ffmpeg -version
```

### Linux
```bash
sudo apt update
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

---

## Step 3: Setup Backend

Open terminal and navigate to backend folder:

```bash
cd "d:\projects\AstraVideo AI\backend"

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows Command Prompt
venv\Scripts\activate
# Windows PowerShell
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

---

## Step 4: Setup Worker

Open NEW terminal and navigate to worker folder:

```bash
cd "d:\projects\AstraVideo AI\worker"

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows Command Prompt  
venv\Scripts\activate
# Windows PowerShell
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

---

## Step 5: Setup Frontend

Open NEW terminal and navigate to frontend folder:

```bash
cd "d:\projects\AstraVideo AI\frontend"

# Install Node.js dependencies
npm install

# OR with yarn
yarn install
```

---

## Step 6: Start All Services

### 6.1 Start Redis (if not running)
```bash
# If using Docker
docker start redis

# If installed directly
redis-server
```

### 6.2 Start Backend API
In the backend terminal (with venv activated):

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 6.3 Start Celery Worker  
In the worker terminal (with venv activated):

```bash
celery -A video_processor worker --loglevel=info
```

You should see:
```
-------------- celery@hostname v5.3.6
---- **** ----- 
--- * ***  * -- Linux-5.15.0-x86_64-with-glibc2.31 2024-04-14 21:00:00
-- * - **** --- 
- ** ---------- [config]
- ** ---------- .> app:         video_processor:0x12345678
- ** ---------- .> transport:   redis://localhost:6379/1
- ** ---------- .> results:     redis://localhost:6379/2
--- *** ----- * --- .> concurrency: 4
-- ******* ---- .> events: OFF
--- ***** ----- 
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery
```

### 6.4 Start Frontend
In the frontend terminal:

```bash
npm run dev

# OR with yarn
yarn dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Step 7: Verify Everything Works

### 7.1 Test Backend API
Open browser: http://localhost:8000

You should see:
```json
{"message": "AstraVideo AI API", "version": "1.0.0"}
```

### 7.2 Test Health Endpoint
Open: http://localhost:8000/api/health

You should see:
```json
{"status": "healthy", "redis": "connected"}
```

### 7.3 Open Frontend
Open browser: http://localhost:3000

You should see the AstraVideo AI landing page with animated hero section.

---

## Step 8: Test Video Generation

### 8.1 Navigate to Dashboard
1. Click "Get Started" or "Start Creating" button
2. You should see the dashboard with prompt input

### 8.2 Generate First Video
1. Enter a prompt: "A beautiful sunset over mountains"
2. Select style: "cinematic"  
3. Set duration: 10 seconds
4. Set FPS: 16
5. Click "Generate Video"

### 8.3 Monitor Progress
1. You should see "Generating..." status
2. Check worker terminal for processing logs
3. After ~30 seconds, status should change to "completed"

### 8.4 View Generated Video
1. Navigate to Gallery page
2. You should see your generated video
3. Click play button to view

---

## Troubleshooting Common Issues

### Issue: "Redis connection failed"
**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not running, start Redis
redis-server
```

### Issue: "FFmpeg not found"
**Solution:**
```bash
# Check FFmpeg installation
ffmpeg -version

# If not found, install FFmpeg (see Step 2)
# Add FFmpeg to system PATH
```

### Issue: "Module not found" errors in frontend
**Solution:**
```bash
cd frontend
npm install
# Restart dev server
npm run dev
```

### Issue: "Python module not found" errors
**Solution:**
```bash
cd backend  # or worker
# Activate virtual environment
venv\Scripts\activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Kill process or change port in config
```

### Issue: "ModelScope download failed"
**Solution:**
The system includes fallback demo videos. If ModelScope fails to download, it will automatically create demo videos for testing.

---

## Development Workflow

### Daily Development Start
1. Start Redis: `redis-server`
2. Start Backend: `cd backend && venv\Scripts\activate && python main.py`
3. Start Worker: `cd worker && venv\Scripts\activate && celery -A video_processor worker --loglevel=info`
4. Start Frontend: `cd frontend && npm run dev`

### Making Changes
- **Frontend changes**: Hot reload automatically
- **Backend changes**: Restart FastAPI server
- **Worker changes**: Restart Celery worker

### Monitoring
- **Backend logs**: Check terminal where `python main.py` is running
- **Worker logs**: Check terminal where Celery worker is running
- **Redis monitoring**: `redis-cli monitor`

---

## Production Considerations

For production deployment:
1. Use Docker containers
2. Set up Redis cluster
3. Configure proper CORS and security
4. Add database persistence
5. Set up load balancer
6. Configure CDN for video serving

---

## Success Checklist

- [ ] Redis is running and accessible
- [ ] Backend API responds on http://localhost:8000
- [ ] Celery worker is connected to Redis
- [ ] Frontend loads on http://localhost:3000
- [ ] Can generate videos from dashboard
- [ ] Videos appear in gallery after completion
- [ ] Can play and download generated videos

If all checkboxes are checked, your AstraVideo AI platform is running successfully!
