"""
VIRAL ENGINE PRO - BACKEND API
FastAPI-powered video generation engine
Built: December 13, 2025
Company: RJ Business Solutions
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
import asyncio

# Import services
from services.video_composer import VideoComposer
from services.storage_manager import StorageManager
from services.trend_analyzer import TrendAnalyzer
from services.social_poster import SocialPoster
from services.analytics_tracker import AnalyticsTracker
from database.models import VideoJob, User, Template
from database.connection import get_db

# Initialize FastAPI
app = FastAPI(
    title="Viral Engine Pro API",
    description="Enterprise video generation platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://viral-engine-pro.vercel.app",
        "https://*.viral-engine-pro.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Initialize services
video_composer = VideoComposer()
storage_manager = StorageManager()
trend_analyzer = TrendAnalyzer()
social_poster = SocialPoster()
analytics_tracker = AnalyticsTracker()

# ===========================================
# AUTHENTICATION
# ===========================================

async def verify_api_key(x_api_key: str = Header(...)):
    """Verify API key from request header"""
    if x_api_key != os.getenv("API_SECRET_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

# ===========================================
# REQUEST/RESPONSE MODELS
# ===========================================

class VideoGenerationRequest(BaseModel):
    template_id: str
    user_inputs: Dict[str, Any]
    voice_id: Optional[str] = None
    background_style: Optional[str] = None
    duration: Optional[int] = None
    output_format: Optional[str] = "mp4"

class BulkGenerationRequest(BaseModel):
    template_id: str
    count: int
    variations: List[Dict[str, Any]]
    voice_id: Optional[str] = None

class TrendAnalysisRequest(BaseModel):
    platform: str = "tiktok"
    niche: Optional[str] = None
    limit: int = 10

class SchedulePostRequest(BaseModel):
    video_url: str
    platforms: List[str]
    scheduled_time: str
    caption: str
    hashtags: List[str]

class StorageUploadRequest(BaseModel):
    filename: str
    data: str  # Base64 encoded
    content_type: str

# ===========================================
# VIDEO GENERATION ENDPOINTS
# ===========================================

@app.post("/api/video/generate")
async def generate_video(
    request: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key),
    db = Depends(get_db)
):
    """
    Generate a video from template
    """
    try:
        # Create job
        job_id = f"job_{datetime.now().timestamp()}_{os.urandom(4).hex()}"
        
        # Create database record
        video_job = VideoJob(
            id=job_id,
            template_id=request.template_id,
            status="pending",
            created_at=datetime.now()
        )
        db.add(video_job)
        db.commit()
        
        # Start generation in background
        background_tasks.add_task(
            process_video_generation,
            job_id,
            request
        )
        
        return {
            "success": True,
            "job_id": job_id,
            "status": "pending",
            "message": "Video generation started"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/video/compose")
async def compose_video(
    composition: Dict[str, Any],
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Compose video using FFmpeg with full configuration
    """
    try:
        job_id = composition.get("jobId")
        
        # Start composition in background
        background_tasks.add_task(
            video_composer.compose,
            job_id,
            composition.get("composition")
        )
        
        return {
            "success": True,
            "job_id": job_id,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/video/status/{job_id}")
async def get_video_status(
    job_id: str,
    api_key: str = Depends(verify_api_key),
    db = Depends(get_db)
):
    """
    Get video generation status
    """
    try:
        job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "job_id": job.id,
            "status": job.status,
            "progress": job.progress,
            "video_url": job.video_url,
            "error": job.error,
            "created_at": job.created_at.isoformat(),
            "completed_at": job.completed_at.isoformat() if job.completed_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/video/bulk-generate")
async def bulk_generate_videos(
    request: BulkGenerationRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Generate multiple videos in bulk
    """
    try:
        bulk_job_id = f"bulk_{datetime.now().timestamp()}_{os.urandom(4).hex()}"
        
        # Create individual jobs
        job_ids = []
        for i, variation in enumerate(request.variations):
            job_id = f"{bulk_job_id}_{i}"
            job_ids.append(job_id)
            
            # Start generation
            background_tasks.add_task(
                process_video_generation,
                job_id,
                VideoGenerationRequest(
                    template_id=request.template_id,
                    user_inputs=variation,
                    voice_id=request.voice_id
                )
            )
        
        return {
            "success": True,
            "bulk_job_id": bulk_job_id,
            "job_ids": job_ids,
            "total": len(job_ids),
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# STORAGE ENDPOINTS
# ===========================================

@app.post("/api/storage/upload")
async def upload_to_storage(
    request: StorageUploadRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Upload file to Cloudflare R2 storage
    """
    try:
        import base64
        
        # Decode base64
        file_data = base64.b64decode(request.data)
        
        # Upload to R2
        url = await storage_manager.upload(
            filename=request.filename,
            data=file_data,
            content_type=request.content_type
        )
        
        return {
            "success": True,
            "url": url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/background-clips")
async def get_background_clips(
    type: str,
    subtype: Optional[str] = None,
    minDuration: Optional[int] = None
):
    """
    Get available background video clips
    """
    try:
        clips = await storage_manager.get_background_clips(
            clip_type=type,
            subtype=subtype,
            min_duration=minDuration
        )
        
        return {
            "success": True,
            "clips": clips
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# TREND ANALYSIS ENDPOINTS
# ===========================================

@app.post("/api/trends/analyze")
async def analyze_trends(
    request: TrendAnalysisRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Analyze current viral trends
    """
    try:
        trends = await trend_analyzer.analyze(
            platform=request.platform,
            niche=request.niche,
            limit=request.limit
        )
        
        return {
            "success": True,
            "trends": trends,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trends/suggestions")
async def get_trend_suggestions(
    template_id: Optional[str] = None,
    api_key: str = Depends(verify_api_key)
):
    """
    Get AI-powered trend suggestions
    """
    try:
        suggestions = await trend_analyzer.get_suggestions(
            template_id=template_id
        )
        
        return {
            "success": True,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# SOCIAL POSTING ENDPOINTS
# ===========================================

@app.post("/api/social/schedule")
async def schedule_post(
    request: SchedulePostRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Schedule video post to social platforms
    """
    try:
        post_id = await social_poster.schedule_post(
            video_url=request.video_url,
            platforms=request.platforms,
            scheduled_time=request.scheduled_time,
            caption=request.caption,
            hashtags=request.hashtags
        )
        
        return {
            "success": True,
            "post_id": post_id,
            "scheduled_time": request.scheduled_time,
            "platforms": request.platforms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/social/post-now")
async def post_now(
    video_url: str,
    platforms: List[str],
    caption: str,
    hashtags: List[str],
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Post video immediately to social platforms
    """
    try:
        background_tasks.add_task(
            social_poster.post_immediately,
            video_url,
            platforms,
            caption,
            hashtags
        )
        
        return {
            "success": True,
            "status": "posting",
            "platforms": platforms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# ANALYTICS ENDPOINTS
# ===========================================

@app.get("/api/analytics/dashboard")
async def get_analytics_dashboard(
    user_id: str,
    date_range: str = "7d",
    api_key: str = Depends(verify_api_key)
):
    """
    Get analytics dashboard data
    """
    try:
        data = await analytics_tracker.get_dashboard(
            user_id=user_id,
            date_range=date_range
        )
        
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/track-event")
async def track_event(
    event_name: str,
    properties: Dict[str, Any],
    api_key: str = Depends(verify_api_key)
):
    """
    Track custom analytics event
    """
    try:
        await analytics_tracker.track(
            event_name=event_name,
            properties=properties
        )
        
        return {
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# VIDEO PROCESSING UTILITIES
# ===========================================

@app.post("/api/video/optimize")
async def optimize_video(
    video_url: str,
    platform: str,
    quality: str = "high",
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Optimize video for specific platform
    """
    try:
        job_id = f"optimize_{datetime.now().timestamp()}"
        
        background_tasks.add_task(
            video_composer.optimize_for_platform,
            video_url,
            platform,
            quality,
            job_id
        )
        
        return {
            "success": True,
            "job_id": job_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/video/thumbnail")
async def generate_thumbnail(
    video_url: str,
    timestamp: int = 1,
    api_key: str = Depends(verify_api_key)
):
    """
    Generate thumbnail from video
    """
    try:
        thumbnail_url = await video_composer.generate_thumbnail(
            video_url=video_url,
            timestamp=timestamp
        )
        
        return {
            "success": True,
            "thumbnail_url": thumbnail_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/video/metadata")
async def get_video_metadata(
    video_url: str,
    api_key: str = Depends(verify_api_key)
):
    """
    Get video metadata
    """
    try:
        metadata = await video_composer.get_metadata(video_url)
        
        return {
            "success": True,
            **metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===========================================
# HEALTH CHECK
# ===========================================

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "name": "Viral Engine Pro API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "company": "RJ Business Solutions"
    }

# ===========================================
# BACKGROUND TASKS
# ===========================================

async def process_video_generation(job_id: str, request: VideoGenerationRequest):
    """
    Background task for video generation
    """
    # Implementation in video_composer service
    await video_composer.process_generation(job_id, request)

# ===========================================
# MAIN
# ===========================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=4
    )
