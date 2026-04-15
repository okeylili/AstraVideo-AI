from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import uuid
import redis
import json
from datetime import datetime
import os
from celery import Celery

app = FastAPI(title="AstraVideo AI API", version="1.0.0")

# Setup static file serving for videos
outputs_dir = os.path.join(os.path.dirname(__file__), "..", "outputs")
if os.path.exists(outputs_dir):
    app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")
else:
    os.makedirs(outputs_dir, exist_ok=True)
    app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Celery configuration
celery_app = Celery(
    'video_worker',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2'
)

# Pydantic models
class VideoGenerationRequest(BaseModel):
    prompt: str
    style: str = "cinematic"
    duration: int = 10
    fps: int = 16
    seed: Optional[int] = None
    user_id: str = "default_user"

class VideoJob(BaseModel):
    id: str
    prompt: str
    style: str
    duration: int
    fps: int
    seed: Optional[int]
    status: str  # pending, processing, completed, failed
    video_url: Optional[str] = None
    created_at: datetime
    user_id: str

# Helper functions
def create_job_id():
    return str(uuid.uuid4())

def store_job(job: VideoJob):
    job_data = job.dict()
    job_data['created_at'] = job.created_at.isoformat()
    redis_client.set(f"job:{job.id}", json.dumps(job_data))
    
    # Add to user's job list
    redis_client.lpush(f"user_jobs:{job.user_id}", job.id)
    redis_client.expire(f"user_jobs:{job.user_id}", 86400 * 30)  # 30 days

def get_job(job_id: str) -> Optional[VideoJob]:
    job_data = redis_client.get(f"job:{job_id}")
    if not job_data:
        return None
    
    data = json.loads(job_data)
    data['created_at'] = datetime.fromisoformat(data['created_at'])
    return VideoJob(**data)

def get_user_jobs(user_id: str, limit: int = 50) -> List[VideoJob]:
    job_ids = redis_client.lrange(f"user_jobs:{user_id}", 0, limit - 1)
    jobs = []
    for job_id in job_ids:
        job = get_job(job_id)
        if job:
            jobs.append(job)
    return sorted(jobs, key=lambda x: x.created_at, reverse=True)

# API Routes
@app.post("/api/generate", response_model=VideoJob)
async def generate_video(request: VideoGenerationRequest):
    """Create a new video generation job"""
    job_id = create_job_id()
    
    job = VideoJob(
        id=job_id,
        prompt=request.prompt,
        style=request.style,
        duration=request.duration,
        fps=request.fps,
        seed=request.seed,
        status="pending",
        created_at=datetime.utcnow(),
        user_id=request.user_id
    )
    
    store_job(job)
    
    # Queue the job for processing
    celery_app.send_task(
        'video_processor.process_video',
        args=[job_id],
        kwargs={
            'prompt': request.prompt,
            'style': request.style,
            'duration': request.duration,
            'fps': request.fps,
            'seed': request.seed
        }
    )
    
    return job

@app.get("/api/status/{job_id}", response_model=VideoJob)
async def get_job_status(job_id: str):
    """Get the status of a video generation job"""
    job = get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    return job

@app.get("/api/history/{user_id}", response_model=List[VideoJob])
async def get_user_history(user_id: str, limit: int = 50):
    """Get all jobs for a user"""
    jobs = get_user_jobs(user_id, limit)
    return jobs

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        redis_client.ping()
        return {"status": "healthy", "redis": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/")
async def root():
    return {"message": "AstraVideo AI API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
