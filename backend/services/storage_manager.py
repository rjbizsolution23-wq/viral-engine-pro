"""
VIRAL ENGINE PRO - STORAGE MANAGER
Cloudflare R2 storage integration
Built: December 13, 2025
Company: RJ Business Solutions
"""

import boto3
from botocore.client import Config
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
import mimetypes
from datetime import datetime

class StorageManager:
    def __init__(self):
        # Initialize Cloudflare R2 client (S3-compatible)
        self.s3_client = boto3.client(
            's3',
            endpoint_url=os.getenv('CLOUDFLARE_R2_ENDPOINT'),
            aws_access_key_id=os.getenv('CLOUDFLARE_R2_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )
        
        self.bucket_name = os.getenv('CLOUDFLARE_R2_BUCKET_NAME', 'viral-engine-pro')
        self.cdn_url = os.getenv('CLOUDFLARE_CDN_URL', 'https://cdn.viral-engine-pro.com')
    
    async def upload(
        self,
        filename: str,
        data: bytes,
        content_type: str,
        folder: str = 'uploads'
    ) -> str:
        """
        Upload file to Cloudflare R2
        """
        try:
            # Generate unique key
            timestamp = datetime.now().strftime('%Y/%m/%d')
            key = f"{folder}/{timestamp}/{filename}"
            
            # Upload to R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=data,
                ContentType=content_type,
                CacheControl='max-age=31536000',  # 1 year cache
                Metadata={
                    'uploaded_at': datetime.now().isoformat()
                }
            )
            
            # Return CDN URL
            return f"{self.cdn_url}/{key}"
        except Exception as e:
            print(f"Upload error: {str(e)}")
            raise
    
    async def upload_video(self, file_path: Path, job_id: str) -> str:
        """
        Upload video file
        """
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            filename = f"{job_id}_{file_path.name}"
            content_type = mimetypes.guess_type(str(file_path))[0] or 'video/mp4'
            
            return await self.upload(filename, data, content_type, folder='videos')
        except Exception as e:
            print(f"Video upload error: {str(e)}")
            raise
    
    async def upload_image(self, file_path: Path, job_id: str) -> str:
        """
        Upload image file
        """
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            filename = f"{job_id}_{file_path.name}"
            content_type = mimetypes.guess_type(str(file_path))[0] or 'image/jpeg'
            
            return await self.upload(filename, data, content_type, folder='images')
        except Exception as e:
            print(f"Image upload error: {str(e)}")
            raise
    
    async def upload_audio(self, file_path: Path, job_id: str) -> str:
        """
        Upload audio file
        """
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            filename = f"{job_id}_{file_path.name}"
            content_type = mimetypes.guess_type(str(file_path))[0] or 'audio/mpeg'
            
            return await self.upload(filename, data, content_type, folder='audio')
        except Exception as e:
            print(f"Audio upload error: {str(e)}")
            raise
    
    async def get_background_clips(
        self,
        clip_type: str,
        subtype: Optional[str] = None,
        min_duration: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Get available background video clips
        """
        try:
            # List objects with prefix
            prefix = f"backgrounds/{clip_type}/"
            if subtype:
                prefix += f"{subtype}/"
            
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            clips = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    # Get object metadata
                    metadata = self.s3_client.head_object(
                        Bucket=self.bucket_name,
                        Key=obj['Key']
                    )
                    
                    duration = int(metadata.get('Metadata', {}).get('duration', 0))
                    
                    # Filter by duration if specified
                    if min_duration and duration < min_duration:
                        continue
                    
                    clips.append({
                        'url': f"{self.cdn_url}/{obj['Key']}",
                        'duration': duration,
                        'size': obj['Size'],
                        'type': clip_type,
                        'subtype': subtype
                    })
            
            return clips
        except Exception as e:
            print(f"Get background clips error: {str(e)}")
            return []
    
    async def delete_file(self, url: str) -> bool:
        """
        Delete file from R2
        """
        try:
            # Extract key from URL
            key = url.replace(self.cdn_url + '/', '')
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            
            return True
        except Exception as e:
            print(f"Delete error: {str(e)}")
            return False
    
    async def get_file_metadata(self, url: str) -> Dict[str, Any]:
        """
        Get file metadata
        """
        try:
            key = url.replace(self.cdn_url + '/', '')
            
            response = self.s3_client.head_object(
                Bucket=self.bucket_name,
                Key=key
            )
            
            return {
                'size': response['ContentLength'],
                'content_type': response['ContentType'],
                'last_modified': response['LastModified'].isoformat(),
                'metadata': response.get('Metadata', {})
            }
        except Exception as e:
            print(f"Get metadata error: {str(e)}")
            return {}
    
    async def generate_presigned_url(
        self,
        key: str,
        expiration: int = 3600
    ) -> str:
        """
        Generate presigned URL for temporary access
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': key
                },
                ExpiresIn=expiration
            )
            return url
        except Exception as e:
            print(f"Presigned URL error: {str(e)}")
            raise
    
    async def copy_file(self, source_url: str, destination_key: str) -> str:
        """
        Copy file within R2
        """
        try:
            source_key = source_url.replace(self.cdn_url + '/', '')
            
            self.s3_client.copy_object(
                Bucket=self.bucket_name,
                CopySource={'Bucket': self.bucket_name, 'Key': source_key},
                Key=destination_key
            )
            
            return f"{self.cdn_url}/{destination_key}"
        except Exception as e:
            print(f"Copy error: {str(e)}")
            raise
    
    async def list_files(
        self,
        prefix: str = '',
        max_results: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        List files in bucket
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=max_results
            )
            
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    files.append({
                        'key': obj['Key'],
                        'url': f"{self.cdn_url}/{obj['Key']}",
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat()
                    })
            
            return files
        except Exception as e:
            print(f"List files error: {str(e)}")
            return []
    
    async def get_storage_stats(self) -> Dict[str, Any]:
        """
        Get storage statistics
        """
        try:
            # Count objects and total size
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name
            )
            
            total_size = 0
            total_count = 0
            
            if 'Contents' in response:
                total_count = len(response['Contents'])
                total_size = sum(obj['Size'] for obj in response['Contents'])
            
            # Get size by folder
            folders = {}
            if 'Contents' in response:
                for obj in response['Contents']:
                    folder = obj['Key'].split('/')[0]
                    if folder not in folders:
                        folders[folder] = {'count': 0, 'size': 0}
                    folders[folder]['count'] += 1
                    folders[folder]['size'] += obj['Size']
            
            return {
                'total_files': total_count,
                'total_size_bytes': total_size,
                'total_size_mb': round(total_size / (1024 * 1024), 2),
                'total_size_gb': round(total_size / (1024 * 1024 * 1024), 2),
                'folders': folders
            }
        except Exception as e:
            print(f"Storage stats error: {str(e)}")
            return {}
