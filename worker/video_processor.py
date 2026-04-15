import os
import subprocess
import torch
import numpy as np
from PIL import Image
import imageio
from datetime import datetime
import redis
import json
from celery import Celery
from celery_app import celery_app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def update_job_status(job_id: str, status: str, video_url: str = None):
    """Update job status in Redis"""
    job_data = redis_client.get(f"job:{job_id}")
    if job_data:
        job = json.loads(job_data)
        job['status'] = status
        if video_url:
            job['video_url'] = video_url
        redis_client.set(f"job:{job_id}", json.dumps(job))

def enhance_prompt(prompt: str, style: str) -> str:
    """Enhance prompt with style-specific templates"""
    style_templates = {
        "cinematic": f"cinematic, highly detailed, ultra realistic, {prompt}",
        "anime": f"anime style, vibrant colors, detailed animation, {prompt}",
        "realistic": f"photorealistic, ultra detailed, 8k, {prompt}",
        "3d-render": f"3d render, octane render, highly detailed, {prompt}"
    }
    return style_templates.get(style, style_templates["cinematic"])

def generate_video_frames(prompt: str, duration: int, fps: int, seed: int = None):
    """Generate video frames using ModelScope text-to-video model"""
    try:
        from modelscope.pipelines import pipeline
        from modelscope.utils.constant import Tasks
        
        logger.info(f"Loading ModelScope text-to-video model...")
        
        # Initialize the text-to-video pipeline
        pipe = pipeline(
            task=Tasks.text_to_video_synthesis,
            model='damo/text-to-video-synthesis',
            model_revision='v1.1.0'
        )
        
        logger.info(f"Generating video with prompt: {prompt}")
        
        # Generate video
        output_video_path = pipe(
            text=prompt,
            output_video=f"temp_frames_{seed or 'random'}"
        )
        
        return output_video_path
        
    except Exception as e:
        logger.error(f"Error in video generation: {str(e)}")
        raise

def convert_frames_to_mp4(frames_path: str, output_path: str, fps: int):
    """Convert generated frames to MP4 using ffmpeg"""
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Use ffmpeg to convert frames to MP4
        cmd = [
            'ffmpeg',
            '-y',  # Overwrite output file
            '-framerate', str(fps),
            '-i', f'{frames_path}/%08d.png',  # Input frame pattern
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-crf', '23',
            '-preset', 'medium',
            output_path
        ]
        
        logger.info(f"Running ffmpeg command: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"FFmpeg error: {result.stderr}")
            raise Exception(f"FFmpeg conversion failed: {result.stderr}")
            
        logger.info(f"Successfully converted video to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error in video conversion: {str(e)}")
        raise

def create_demo_video(output_path: str, duration: int, fps: int):
    """Create a demo video when ModelScope is not available"""
    try:
        # Create a simple demo video with colored frames
        width, height = 256, 256
        frames = []
        
        for i in range(duration * fps):
            # Create a gradient frame that changes over time
            frame = np.zeros((height, width, 3), dtype=np.uint8)
            
            # Create a moving gradient effect
            for y in range(height):
                for x in range(width):
                    frame[y, x, 0] = int((x + i * 2) % 256)  # Red
                    frame[y, x, 1] = int((y + i * 3) % 256)  # Green  
                    frame[y, x, 2] = int((x + y + i) % 256)  # Blue
            
            frames.append(frame)
        
        # Write video using imageio
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        imageio.mimsave(output_path, frames, fps=fps)
        
        logger.info(f"Created demo video: {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Error creating demo video: {str(e)}")
        raise

@celery_app.task(bind=True)
def process_video(self, job_id: str, prompt: str, style: str, duration: int, fps: int, seed: int = None):
    """Main video processing task"""
    try:
        logger.info(f"Starting video processing for job {job_id}")
        
        # Update status to processing
        update_job_status(job_id, "processing")
        self.update_state(state='PROCESSING', meta={'status': 'processing'})
        
        # Enhance prompt
        enhanced_prompt = enhance_prompt(prompt, style)
        logger.info(f"Enhanced prompt: {enhanced_prompt}")
        
        # Generate output path
        outputs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "outputs")
        video_filename = f"{job_id}.mp4"
        output_path = os.path.join(outputs_dir, video_filename)
        
        try:
            # Try to use ModelScope for video generation
            frames_path = generate_video_frames(enhanced_prompt, duration, fps, seed)
            video_path = convert_frames_to_mp4(frames_path, output_path, fps)
        except Exception as e:
            logger.warning(f"ModelScope generation failed, creating demo video: {str(e)}")
            # Fallback to demo video
            video_path = create_demo_video(output_path, duration, fps)
        
        # Update job status to completed
        video_url = f"http://localhost:8000/outputs/{video_filename}"
        update_job_status(job_id, "completed", video_url)
        
        logger.info(f"Video processing completed for job {job_id}")
        return {
            'status': 'completed',
            'job_id': job_id,
            'video_url': video_url
        }
        
    except Exception as e:
        logger.error(f"Video processing failed for job {job_id}: {str(e)}")
        # Update job status to failed
        update_job_status(job_id, "failed")
        
        self.update_state(
            state='FAILURE',
            meta={'status': 'failed', 'error': str(e)}
        )
        
        raise
