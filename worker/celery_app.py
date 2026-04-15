from celery import Celery
import redis
import json
import os
from datetime import datetime

# Celery configuration
celery_app = Celery(
    'video_worker',
    broker='redis://localhost:6379/1',
    backend='redis://localhost:6379/2'
)

# Redis connection for job storage
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1,
)
