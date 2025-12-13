"""
🎯 COMPLETE SOCIAL POSTING SERVICE - VIRAL ENGINE PRO
Built: December 13, 2025
Company: RJ Business Solutions

Full integration with TikTok, Instagram, and YouTube APIs
"""

import asyncio
import aiohttp
import json
import hashlib
import hmac
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import httpx
from pathlib import Path

# ═══════════════════════════════════════════════════════════════
# PLATFORM CONFIGURATIONS
# ═══════════════════════════════════════════════════════════════

class Platform(Enum):
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"
    
@dataclass
class PlatformCredentials:
    """Platform-specific credentials"""
    platform: Platform
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    account_id: Optional[str] = None
    username: Optional[str] = None

@dataclass
class VideoPost:
    """Video post configuration"""
    video_path: str
    title: str
    description: str
    hashtags: List[str]
    privacy: str = "public"  # public, private, followers_only
    allow_comments: bool = True
    allow_duet: bool = True  # TikTok specific
    allow_stitch: bool = True  # TikTok specific
    scheduled_time: Optional[datetime] = None
    thumbnail_path: Optional[str] = None
    category: Optional[str] = None

# ═══════════════════════════════════════════════════════════════
# TIKTOK API INTEGRATION
# ═══════════════════════════════════════════════════════════════

class TikTokAPI:
    """
    TikTok Content Posting API Integration
    Uses TikTok's official Content Posting API
    Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
    """
    
    def __init__(self, credentials: PlatformCredentials):
        self.credentials = credentials
        self.base_url = "https://open.tiktokapis.com/v2"
        self.upload_url = "https://open-upload.tiktokapis.com/video/upload"
        
    async def refresh_access_token(self) -> str:
        """Refresh expired access token"""
        if not self.credentials.refresh_token:
            raise ValueError("No refresh token available")
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://open.tiktokapis.com/v2/oauth/token/",
                data={
                    "client_key": "YOUR_CLIENT_KEY",
                    "client_secret": "YOUR_CLIENT_SECRET",
                    "grant_type": "refresh_token",
                    "refresh_token": self.credentials.refresh_token
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.credentials.access_token = data["access_token"]
                self.credentials.refresh_token = data.get("refresh_token")
                self.credentials.token_expires_at = datetime.now() + timedelta(seconds=data["expires_in"])
                return data["access_token"]
            else:
                raise Exception(f"Token refresh failed: {response.text}")
    
    async def initialize_upload(self, video_size: int) -> Dict[str, Any]:
        """
        Initialize video upload
        Returns upload_url and upload_id
        """
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "post_info": {
                "title": "",
                "privacy_level": "SELF_ONLY",
                "disable_duet": False,
                "disable_comment": False,
                "disable_stitch": False,
                "video_cover_timestamp_ms": 1000
            },
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": video_size,
                "chunk_size": 10000000,  # 10MB chunks
                "total_chunk_count": (video_size // 10000000) + 1
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/post/publish/video/init/",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                return response.json()["data"]
            else:
                raise Exception(f"Upload initialization failed: {response.text}")
    
    async def upload_video_chunks(
        self,
        video_path: str,
        upload_url: str,
        chunk_size: int = 10000000
    ) -> bool:
        """Upload video in chunks"""
        file_size = Path(video_path).stat().st_size
        
        with open(video_path, 'rb') as video_file:
            chunk_number = 0
            
            while True:
                chunk = video_file.read(chunk_size)
                if not chunk:
                    break
                
                headers = {
                    "Authorization": f"Bearer {self.credentials.access_token}",
                    "Content-Type": "video/mp4",
                    "Content-Range": f"bytes {chunk_number * chunk_size}-{min((chunk_number + 1) * chunk_size, file_size) - 1}/{file_size}",
                    "Content-Length": str(len(chunk))
                }
                
                async with httpx.AsyncClient(timeout=300.0) as client:
                    response = await client.put(
                        upload_url,
                        headers=headers,
                        content=chunk
                    )
                    
                    if response.status_code not in [200, 201]:
                        raise Exception(f"Chunk upload failed: {response.text}")
                
                chunk_number += 1
        
        return True
    
    async def publish_video(
        self,
        publish_id: str,
        post_config: VideoPost
    ) -> Dict[str, Any]:
        """
        Publish the uploaded video
        """
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Content-Type": "application/json"
        }
        
        # Format caption with hashtags
        caption = f"{post_config.description}\n\n"
        caption += " ".join([f"#{tag}" for tag in post_config.hashtags])
        
        payload = {
            "publish_id": publish_id,
            "post_info": {
                "title": post_config.title[:150],  # Max 150 chars
                "description": caption[:2200],  # Max 2200 chars
                "privacy_level": "PUBLIC_TO_EVERYONE" if post_config.privacy == "public" else "SELF_ONLY",
                "disable_duet": not post_config.allow_duet,
                "disable_comment": not post_config.allow_comments,
                "disable_stitch": not post_config.allow_stitch,
                "video_cover_timestamp_ms": 1000
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/post/publish/video/publish/",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                return response.json()["data"]
            else:
                raise Exception(f"Video publish failed: {response.text}")
    
    async def post_video(self, post_config: VideoPost) -> Dict[str, Any]:
        """
        Complete flow: Initialize -> Upload -> Publish
        """
        # Get video file size
        video_path = Path(post_config.video_path)
        video_size = video_path.stat().st_size
        
        # Step 1: Initialize upload
        print("🔄 Initializing TikTok upload...")
        init_data = await self.initialize_upload(video_size)
        upload_url = init_data["upload_url"]
        publish_id = init_data["publish_id"]
        
        # Step 2: Upload video chunks
        print("📤 Uploading video to TikTok...")
        await self.upload_video_chunks(post_config.video_path, upload_url)
        
        # Step 3: Publish video
        print("🚀 Publishing video on TikTok...")
        result = await self.publish_video(publish_id, post_config)
        
        return {
            "platform": "tiktok",
            "success": True,
            "post_id": result.get("publish_id"),
            "share_url": f"https://www.tiktok.com/@{self.credentials.username}/video/{result.get('publish_id')}",
            "published_at": datetime.now().isoformat()
        }

# ═══════════════════════════════════════════════════════════════
# INSTAGRAM API INTEGRATION
# ═══════════════════════════════════════════════════════════════

class InstagramAPI:
    """
    Instagram Content Publishing API (Reels)
    Uses Instagram Graph API
    Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
    """
    
    def __init__(self, credentials: PlatformCredentials):
        self.credentials = credentials
        self.base_url = "https://graph.instagram.com/v18.0"
        
    async def create_media_container(
        self,
        video_url: str,
        post_config: VideoPost
    ) -> str:
        """Create media container for video"""
        
        # Format caption with hashtags
        caption = f"{post_config.description}\n\n"
        caption += " ".join([f"#{tag}" for tag in post_config.hashtags])
        
        params = {
            "access_token": self.credentials.access_token,
            "media_type": "REELS",
            "video_url": video_url,
            "caption": caption[:2200],  # Max 2200 chars
            "share_to_feed": True
        }
        
        # Add thumbnail if provided
        if post_config.thumbnail_path:
            params["thumb_offset"] = 1000  # 1 second
        
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{self.base_url}/{self.credentials.account_id}/media",
                params=params
            )
            
            if response.status_code == 200:
                return response.json()["id"]
            else:
                raise Exception(f"Media container creation failed: {response.text}")
    
    async def check_container_status(self, container_id: str) -> Dict[str, Any]:
        """Check if media container is ready"""
        params = {
            "access_token": self.credentials.access_token,
            "fields": "status_code,status"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/{container_id}",
                params=params
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Status check failed: {response.text}")
    
    async def publish_media(self, container_id: str) -> Dict[str, Any]:
        """Publish the media container"""
        params = {
            "access_token": self.credentials.access_token,
            "creation_id": container_id
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/{self.credentials.account_id}/media_publish",
                params=params
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Media publish failed: {response.text}")
    
    async def post_video(
        self,
        post_config: VideoPost,
        video_url: str  # Must be publicly accessible HTTPS URL
    ) -> Dict[str, Any]:
        """
        Complete flow: Create Container -> Wait for Processing -> Publish
        """
        # Step 1: Create media container
        print("🔄 Creating Instagram media container...")
        container_id = await self.create_media_container(video_url, post_config)
        
        # Step 2: Wait for video processing
        print("⏳ Waiting for Instagram to process video...")
        max_attempts = 60
        attempt = 0
        
        while attempt < max_attempts:
            status = await self.check_container_status(container_id)
            
            if status["status_code"] == "FINISHED":
                break
            elif status["status_code"] == "ERROR":
                raise Exception(f"Video processing failed: {status.get('status')}")
            
            await asyncio.sleep(5)
            attempt += 1
        
        if attempt >= max_attempts:
            raise Exception("Video processing timeout")
        
        # Step 3: Publish media
        print("🚀 Publishing video on Instagram...")
        result = await self.publish_media(container_id)
        
        return {
            "platform": "instagram",
            "success": True,
            "post_id": result["id"],
            "share_url": f"https://www.instagram.com/reel/{result['id']}/",
            "published_at": datetime.now().isoformat()
        }

# ═══════════════════════════════════════════════════════════════
# YOUTUBE API INTEGRATION
# ═══════════════════════════════════════════════════════════════

class YouTubeAPI:
    """
    YouTube Data API v3 (Shorts)
    Docs: https://developers.google.com/youtube/v3/docs/videos/insert
    """
    
    def __init__(self, credentials: PlatformCredentials):
        self.credentials = credentials
        self.base_url = "https://www.googleapis.com/youtube/v3"
        self.upload_url = "https://www.googleapis.com/upload/youtube/v3/videos"
    
    async def upload_video(
        self,
        video_path: str,
        post_config: VideoPost
    ) -> Dict[str, Any]:
        """Upload video to YouTube as Short"""
        
        # Format description with hashtags
        description = f"{post_config.description}\n\n"
        description += " ".join([f"#{tag}" for tag in post_config.hashtags])
        description += "\n\n#Shorts"  # Required for Shorts
        
        # Video metadata
        metadata = {
            "snippet": {
                "title": post_config.title[:100],  # Max 100 chars
                "description": description[:5000],  # Max 5000 chars
                "categoryId": "22"  # People & Blogs
            },
            "status": {
                "privacyStatus": post_config.privacy,
                "selfDeclaredMadeForKids": False
            }
        }
        
        # Add thumbnail if provided
        if post_config.thumbnail_path:
            # Thumbnail uploaded separately after video
            pass
        
        headers = {
            "Authorization": f"Bearer {self.credentials.access_token}",
            "Content-Type": "application/json"
        }
        
        # Upload video
        with open(video_path, 'rb') as video_file:
            files = {
                'video': video_file
            }
            
            params = {
                "part": "snippet,status",
                "uploadType": "multipart"
            }
            
            async with httpx.AsyncClient(timeout=600.0) as client:
                # First, create the video resource
                response = await client.post(
                    self.upload_url,
                    headers=headers,
                    params=params,
                    json=metadata
                )
                
                if response.status_code not in [200, 201]:
                    raise Exception(f"Video upload failed: {response.text}")
                
                video_data = response.json()
                video_id = video_data["id"]
                
                # Upload actual video file
                upload_response = await client.post(
                    f"{self.upload_url}?uploadType=resumable",
                    headers={
                        **headers,
                        "Content-Type": "video/*",
                        "X-Upload-Content-Length": str(Path(video_path).stat().st_size)
                    },
                    params={"part": "snippet,status"},
                    json=metadata
                )
                
                if upload_response.status_code not in [200, 201]:
                    raise Exception(f"Video file upload failed: {upload_response.text}")
        
        return {
            "platform": "youtube",
            "success": True,
            "post_id": video_id,
            "share_url": f"https://youtube.com/shorts/{video_id}",
            "published_at": datetime.now().isoformat()
        }

# ═══════════════════════════════════════════════════════════════
# UNIFIED SOCIAL POSTER
# ═══════════════════════════════════════════════════════════════

class SocialMediaPoster:
    """
    Unified social media posting service
    Handles TikTok, Instagram, and YouTube simultaneously
    """
    
    def __init__(self):
        self.platforms = {}
    
    def add_platform(
        self,
        platform: Platform,
        credentials: PlatformCredentials
    ):
        """Add platform credentials"""
        if platform == Platform.TIKTOK:
            self.platforms[platform] = TikTokAPI(credentials)
        elif platform == Platform.INSTAGRAM:
            self.platforms[platform] = InstagramAPI(credentials)
        elif platform == Platform.YOUTUBE:
            self.platforms[platform] = YouTubeAPI(credentials)
    
    async def post_to_platform(
        self,
        platform: Platform,
        post_config: VideoPost,
        video_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Post to a single platform"""
        if platform not in self.platforms:
            raise ValueError(f"Platform {platform.value} not configured")
        
        api = self.platforms[platform]
        
        try:
            if platform == Platform.INSTAGRAM:
                # Instagram requires public video URL
                if not video_url:
                    raise ValueError("Instagram requires video_url parameter")
                result = await api.post_video(post_config, video_url)
            else:
                # TikTok and YouTube upload from local file
                result = await api.post_video(post_config)
            
            return result
        except Exception as e:
            return {
                "platform": platform.value,
                "success": False,
                "error": str(e),
                "attempted_at": datetime.now().isoformat()
            }
    
    async def post_to_all_platforms(
        self,
        post_config: VideoPost,
        video_url: Optional[str] = None,
        platforms: Optional[List[Platform]] = None
    ) -> List[Dict[str, Any]]:
        """
        Post to multiple platforms simultaneously
        """
        if platforms is None:
            platforms = list(self.platforms.keys())
        
        tasks = [
            self.post_to_platform(platform, post_config, video_url)
            for platform in platforms
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return [
            result if not isinstance(result, Exception) else {
                "success": False,
                "error": str(result)
            }
            for result in results
        ]
    
    async def schedule_post(
        self,
        post_config: VideoPost,
        platforms: List[Platform],
        scheduled_time: datetime
    ) -> Dict[str, Any]:
        """
        Schedule post for future publication
        """
        delay = (scheduled_time - datetime.now()).total_seconds()
        
        if delay <= 0:
            # Post immediately if time has passed
            results = await self.post_to_all_platforms(post_config, platforms=platforms)
        else:
            # Schedule for later
            await asyncio.sleep(delay)
            results = await self.post_to_all_platforms(post_config, platforms=platforms)
        
        return {
            "scheduled_for": scheduled_time.isoformat(),
            "platforms": [p.value for p in platforms],
            "results": results
        }

# ═══════════════════════════════════════════════════════════════
# USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════

async def example_usage():
    """Example of how to use the social poster"""
    
    # Initialize poster
    poster = SocialMediaPoster()
    
    # Add platform credentials
    poster.add_platform(
        Platform.TIKTOK,
        PlatformCredentials(
            platform=Platform.TIKTOK,
            access_token="YOUR_TIKTOK_ACCESS_TOKEN",
            refresh_token="YOUR_TIKTOK_REFRESH_TOKEN",
            account_id="YOUR_TIKTOK_ACCOUNT_ID",
            username="your_username"
        )
    )
    
    poster.add_platform(
        Platform.INSTAGRAM,
        PlatformCredentials(
            platform=Platform.INSTAGRAM,
            access_token="YOUR_INSTAGRAM_ACCESS_TOKEN",
            account_id="YOUR_INSTAGRAM_ACCOUNT_ID"
        )
    )
    
    poster.add_platform(
        Platform.YOUTUBE,
        PlatformCredentials(
            platform=Platform.YOUTUBE,
            access_token="YOUR_YOUTUBE_ACCESS_TOKEN",
            account_id="YOUR_YOUTUBE_CHANNEL_ID"
        )
    )
    
    # Create post configuration
    post = VideoPost(
        video_path="/path/to/video.mp4",
        title="7-Figure Mindset Shift That Changed Everything",
        description="This ONE mindset shift took me from broke to millionaire. Drop a 🔥 if you needed this!",
        hashtags=["motivation", "mindset", "success", "entrepreneur", "wealth"],
        privacy="public",
        allow_comments=True,
        allow_duet=True,
        allow_stitch=True
    )
    
    # Post to all platforms
    results = await poster.post_to_all_platforms(
        post,
        video_url="https://your-cdn.com/video.mp4"  # Required for Instagram
    )
    
    # Print results
    for result in results:
        if result["success"]:
            print(f"✅ {result['platform']}: {result['share_url']}")
        else:
            print(f"❌ {result['platform']}: {result['error']}")

if __name__ == "__main__":
    asyncio.run(example_usage())
