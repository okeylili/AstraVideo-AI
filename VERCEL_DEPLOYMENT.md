# Vercel Deployment Guide for AstraVideo AI

## Environment Variables Setup

### 1. Frontend Environment Variables
Add these in your Vercel dashboard under **Settings > Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
```

### 2. Backend Environment Variables
Add these in Vercel dashboard:

```
REDIS_URL=redis://your-redis-url:6379/0
CELERY_BROKER_URL=redis://your-redis-url:6379/1
CELERY_RESULT_BACKEND=redis://your-redis-url:6379/2
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OUTPUTS_DIR=/tmp/outputs
MODELSCOPE_CACHE_DIR=/tmp/cache
HUGGINGFACE_CACHE_DIR=/tmp/cache/.huggingface
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
ALLOWED_ORIGINS=https://your-app-name.vercel.app
```

## Required External Services

### 1. Redis (for Celery queue and caching)
- **Upstash Redis**: Free tier available
- **Redis Cloud**: Free tier available
- **Redis Labs**: Free tier available

### 2. Worker Service (Separate Deployment)
Since Vercel doesn't support long-running processes like Celery workers, you'll need:
- **Railway**: For Celery worker
- **Render**: For Celery worker  
- **Heroku**: For Celery worker
- **DigitalOcean App Platform**: For Celery worker

## Deployment Steps

### 1. Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `okeylili/AstraVideo-AI`
4. Select the **Next.js** framework
5. Set **Root Directory** to `frontend`
6. Set **Build Command** to `npm run build`
7. Set **Output Directory** to `.next`

### 2. Configure Environment Variables
1. In Vercel project settings, add all environment variables above
2. Make sure to use Vercel's built-in Redis or external Redis URL

### 3. Deploy Backend as Serverless Function
1. Create separate Vercel project for backend
2. Set **Root Directory** to `backend`
3. Set **Build Command** to empty (Python doesn't need build)
4. Set **Runtime** to Python 3.9+

### 4. Deploy Worker Service
Deploy the Celery worker to a service that supports long-running processes:

**Railway Example:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway set PYTHON_VERSION=3.9
railway set REDIS_URL=your-redis-url
railway deploy
```

## Alternative: Docker Deployment

For a complete deployment with all services, consider using Docker:

### 1. Create Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379/0
      - CELERY_BROKER_URL=redis://redis:6379/1
      - CELERY_RESULT_BACKEND=redis://redis:6379/2
    depends_on:
      - redis

  worker:
    build: ./worker
    environment:
      - REDIS_URL=redis://redis:6379/0
      - CELERY_BROKER_URL=redis://redis:6379/1
      - CELERY_RESULT_BACKEND=redis://redis:6379/2
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### 2. Deploy to Cloud Services
- **AWS ECS**: Full container orchestration
- **Google Cloud Run**: Serverless containers
- **Azure Container Instances**: Simple container deployment
- **DigitalOcean App Platform**: Managed containers

## Known Limitations

### Vercel Limitations
- **No long-running processes**: Celery worker cannot run on Vercel
- **Serverless timeout**: Maximum 10-30 seconds for API calls
- **File storage**: No persistent file system for video outputs
- **Cold starts**: May cause delays for first API calls

### Workarounds
1. **Video Storage**: Use AWS S3, Cloudinary, or Vercel Blob
2. **Worker Service**: Deploy to Railway/Render/Heroku
3. **Database**: Use managed Redis service
4. **File Uploads**: Use temporary storage with CDN

## Production Considerations

### 1. Security
- Use HTTPS everywhere
- Implement proper JWT authentication
- Add rate limiting
- Validate all inputs

### 2. Performance
- Use CDN for static assets
- Implement caching strategies
- Monitor API response times
- Optimize video processing

### 3. Scaling
- Horizontal scaling for backend
- Multiple worker instances
- Load balancing
- Auto-scaling based on demand

### 4. Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Log aggregation
- Health checks

## Quick Start for Development

For local development, use the `.env.example` file:

```bash
cp .env.example .env
# Edit .env with your local settings
npm run dev
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test Redis connection
4. Monitor worker service logs
5. Check CORS settings
