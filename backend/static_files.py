from fastapi import FastAPI, StaticFiles
import os

app = FastAPI()

# Mount static files for video serving
app.mount("/outputs", StaticFiles(directory="../outputs"), name="outputs")

# Add this to main.py to serve video files
def setup_static_files(app: FastAPI):
    """Setup static file serving for generated videos"""
    outputs_dir = os.path.join(os.path.dirname(__file__), "..", "outputs")
    if os.path.exists(outputs_dir):
        app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")
    else:
        os.makedirs(outputs_dir, exist_ok=True)
        app.mount("/outputs", StaticFiles(directory=outputs_dir), name="outputs")
