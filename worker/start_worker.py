#!/usr/bin/env python3
import os
import sys

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from celery import Celery
from video_processor import process_video

# Create Celery app
celery_app = Celery(
    'video_worker',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2'
)

# Register the task
celery_app.autodiscover_tasks(['__main__'])

if __name__ == '__main__':
    celery_app.start(['worker', '--loglevel=info'])
