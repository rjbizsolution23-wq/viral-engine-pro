"""
VIRAL ENGINE PRO - SOCIAL POSTER
Auto-posting to TikTok, YouTube, Instagram, Facebook
Built: December 13, 2025
Company: RJ Business Solutions
"""

import os
from typing import List, Dict, Any
import asyncio
import aiohttp
from datetime import datetime
import json

class SocialPoster:
    def __init__(self):
        self.tiktok_api_key = os.getenv('TIKTOK_API_KEY')
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        self.instagram_access_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')
        self.facebook_access_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
    
    async def schedule_post(
        self,
        video_url: str,
        platforms: List[str],
        scheduled_time: str,
        caption: str,
        hashtags: List[str]
    ) -> str:
        """
        Schedule post to multiple platforms
        """
        try:
            post_id = f"post_{datetime.now().timestamp()}"
            
            # Store scheduled post in database
            # (Implementation would use actual database)
            
            # Schedule background task
            scheduled_dt = datetime.fromisoformat(scheduled_time)
            delay = (scheduled_dt - datetime.now()).total_seconds()
            
            if delay > 0:
                asyncio.create_task(
                    self._delayed_post(delay, post_id, video_url, platforms, caption, hashtags)
                )
            else:
                # Post immediately if time has passed
                await self.post_immediately(video_url, platforms, caption, hashtags)
            
            return post_id
        except Exception as e:
            print(f"Schedule post error: {str(e)}")
            raise
    
    async def _delayed_post(
        self,
        delay: float,
        post_id: str,
        video_url: str,
        platforms: List[str],
        caption: str,
        hashtags: List[str]
    ):
        """
        Execute delayed post
        """
        await asyncio.sleep(delay)
        await self.post_immediately(video_url, platforms, caption, hashtags)
    
    async def post_immediately(
        self,
        video_url: str,
        platforms: List[str],
        caption: str,
        hashtags: List[str]
    ) -> Dict[str, Any]:
        """
        Post video immediately to all platforms
        """
        results = {}
        
        # Build caption with hashtags
        full_caption = f"{caption}\n\n{' '.join(f'#{tag}' for tag in hashtags)}"
        
        # Post to each platform
        tasks = []
        for platform in platforms:
            if platform == 'tiktok':
                tasks.append(self._post_to_tiktok(video_url, full_caption))
            elif platform == 'youtube':
                tasks.append(self._post_to_youtube(video_url, caption, hashtags))
            elif platform == 'instagram':
                tasks.append(self._post_to_instagram(video_url, full_caption))
            elif platform == 'facebook':
                tasks.append(self._post_to_facebook(video_url, full_caption))
        
        # Execute all posts
        platform_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Compile results
        for i, platform in enumerate(platforms):
            result = platform_results[i]
            if isinstance(result, Exception):
                results[platform] = {'success': False, 'error': str(result)}
            else:
                results[platform] = result
        
        return results
    
    async def _post_to_tiktok(self, video_url: str, caption: str) -> Dict[str, Any]:
        """
        Post video to TikTok
        """
        try:
            # TikTok Content Posting API
            async with aiohttp.ClientSession() as session:
                # Step 1: Initialize upload
                async with session.post(
                    'https://open-api.tiktok.com/share/video/upload/',
                    headers={
                        'Authorization': f'Bearer {self.tiktok_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'video': {
                            'url': video_url
                        },
                        'caption': caption,
                        'privacy_level': 'PUBLIC_TO_EVERYONE',
                        'disable_duet': False,
                        'disable_comment': False,
                        'disable_stitch': False,
                        'video_cover_timestamp_ms': 1000
                    }
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            'success': True,
                            'platform': 'tiktok',
                            'post_id': data.get('share_id'),
                            'url': f"https://www.tiktok.com/@user/video/{data.get('share_id')}"
                        }
                    else:
                        error = await response.text()
                        return {
                            'success': False,
                            'platform': 'tiktok',
                            'error': f"Status {response.status}: {error}"
                        }
        except Exception as e:
            return {
                'success': False,
                'platform': 'tiktok',
                'error': str(e)
            }
    
    async def _post_to_youtube(
        self,
        video_url: str,
        title: str,
        tags: List[str]
    ) -> Dict[str, Any]:
        """
        Post video to YouTube Shorts
        """
        try:
            # YouTube Data API v3
            async with aiohttp.ClientSession() as session:
                # Step 1: Initialize upload
                async with session.post(
                    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
                    headers={
                        'Authorization': f'Bearer {self.youtube_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'snippet': {
                            'title': title[:100],  # Max 100 chars
                            'description': title,
                            'tags': tags,
                            'categoryId': '22'  # People & Blogs
                        },
                        'status': {
                            'privacyStatus': 'public',
                            'selfDeclaredMadeForKids': False
                        }
                    }
                ) as response:
                    if response.status == 200:
                        upload_url = response.headers.get('Location')
                        
                        # Step 2: Upload video file
                        # Download video first
                        async with session.get(video_url) as video_response:
                            video_data = await video_response.read()
                        
                        # Upload to YouTube
                        async with session.put(
                            upload_url,
                            data=video_data,
                            headers={'Content-Type': 'video/*'}
                        ) as upload_response:
                            if upload_response.status == 200:
                                data = await upload_response.json()
                                return {
                                    'success': True,
                                    'platform': 'youtube',
                                    'post_id': data.get('id'),
                                    'url': f"https://www.youtube.com/shorts/{data.get('id')}"
                                }
                            else:
                                error = await upload_response.text()
                                return {
                                    'success': False,
                                    'platform': 'youtube',
                                    'error': f"Upload failed: {error}"
                                }
                    else:
                        error = await response.text()
                        return {
                            'success': False,
                            'platform': 'youtube',
                            'error': f"Init failed: {error}"
                        }
        except Exception as e:
            return {
                'success': False,
                'platform': 'youtube',
                'error': str(e)
            }
    
    async def _post_to_instagram(self, video_url: str, caption: str) -> Dict[str, Any]:
        """
        Post video to Instagram Reels
        """
        try:
            # Instagram Graph API
            async with aiohttp.ClientSession() as session:
                # Step 1: Create media container
                async with session.post(
                    f'https://graph.instagram.com/v18.0/me/media',
                    params={
                        'video_url': video_url,
                        'caption': caption,
                        'media_type': 'REELS',
                        'access_token': self.instagram_access_token
                    }
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        container_id = data.get('id')
                        
                        # Step 2: Publish media
                        async with session.post(
                            f'https://graph.instagram.com/v18.0/me/media_publish',
                            params={
                                'creation_id': container_id,
                                'access_token': self.instagram_access_token
                            }
                        ) as publish_response:
                            if publish_response.status == 200:
                                publish_data = await publish_response.json()
                                return {
                                    'success': True,
                                    'platform': 'instagram',
                                    'post_id': publish_data.get('id'),
                                    'url': f"https://www.instagram.com/reel/{publish_data.get('id')}"
                                }
                            else:
                                error = await publish_response.text()
                                return {
                                    'success': False,
                                    'platform': 'instagram',
                                    'error': f"Publish failed: {error}"
                                }
                    else:
                        error = await response.text()
                        return {
                            'success': False,
                            'platform': 'instagram',
                            'error': f"Container creation failed: {error}"
                        }
        except Exception as e:
            return {
                'success': False,
                'platform': 'instagram',
                'error': str(e)
            }
    
    async def _post_to_facebook(self, video_url: str, caption: str) -> Dict[str, Any]:
        """
        Post video to Facebook
        """
        try:
            # Facebook Graph API
            async with aiohttp.ClientSession() as session:
                # Download video
                async with session.get(video_url) as video_response:
                    video_data = await video_response.read()
                
                # Upload to Facebook
                async with session.post(
                    f'https://graph.facebook.com/v18.0/me/videos',
                    data={
                        'description': caption,
                        'access_token': self.facebook_access_token
                    },
                    files={'source': video_data}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            'success': True,
                            'platform': 'facebook',
                            'post_id': data.get('id'),
                            'url': f"https://www.facebook.com/{data.get('id')}"
                        }
                    else:
                        error = await response.text()
                        return {
                            'success': False,
                            'platform': 'facebook',
                            'error': f"Upload failed: {error}"
                        }
        except Exception as e:
            return {
                'success': False,
                'platform': 'facebook',
                'error': str(e)
            }
    
    async def get_post_analytics(
        self,
        post_id: str,
        platform: str
    ) -> Dict[str, Any]:
        """
        Get analytics for posted video
        """
        try:
            if platform == 'tiktok':
                return await self._get_tiktok_analytics(post_id)
            elif platform == 'youtube':
                return await self._get_youtube_analytics(post_id)
            elif platform == 'instagram':
                return await self._get_instagram_analytics(post_id)
            elif platform == 'facebook':
                return await self._get_facebook_analytics(post_id)
            else:
                return {'error': 'Unsupported platform'}
        except Exception as e:
            return {'error': str(e)}
    
    async def _get_tiktok_analytics(self, post_id: str) -> Dict[str, Any]:
        """Get TikTok video analytics"""
        # Implementation using TikTok API
        return {
            'views': 0,
            'likes': 0,
            'comments': 0,
            'shares': 0
        }
    
    async def _get_youtube_analytics(self, post_id: str) -> Dict[str, Any]:
        """Get YouTube video analytics"""
        # Implementation using YouTube Analytics API
        return {
            'views': 0,
            'likes': 0,
            'comments': 0,
            'shares': 0
        }
    
    async def _get_instagram_analytics(self, post_id: str) -> Dict[str, Any]:
        """Get Instagram reel analytics"""
        # Implementation using Instagram Insights API
        return {
            'views': 0,
            'likes': 0,
            'comments': 0,
            'shares': 0
        }
    
    async def _get_facebook_analytics(self, post_id: str) -> Dict[str, Any]:
        """Get Facebook video analytics"""
        # Implementation using Facebook Insights API
        return {
            'views': 0,
            'likes': 0,
            'comments': 0,
            'shares': 0
        }
