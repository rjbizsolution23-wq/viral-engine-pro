"""
VIRAL ENGINE PRO - VIDEO COMPOSER SERVICE
FFmpeg-powered video composition engine
Built: December 13, 2025
Company: RJ Business Solutions
"""

import os
import subprocess
import asyncio
from typing import Dict, Any, List
import tempfile
import uuid
from pathlib import Path
import json

from .storage_manager import StorageManager

storage_manager = StorageManager()

class VideoComposer:
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "viral-engine-pro"
        self.temp_dir.mkdir(exist_ok=True)
        
    async def compose(self, job_id: str, composition: Dict[str, Any]) -> str:
        """
        Main composition function - orchestrates entire video creation
        """
        try:
            print(f"[{job_id}] Starting video composition...")
            
            # Create job directory
            job_dir = self.temp_dir / job_id
            job_dir.mkdir(exist_ok=True)
            
            # Download all assets
            print(f"[{job_id}] Downloading assets...")
            await self._download_assets(composition, job_dir)
            
            # Build FFmpeg command
            print(f"[{job_id}] Building FFmpeg command...")
            ffmpeg_cmd = self._build_ffmpeg_command(composition, job_dir)
            
            # Execute FFmpeg
            print(f"[{job_id}] Executing FFmpeg...")
            output_file = job_dir / f"output.{composition['outputFormat']}"
            await self._execute_ffmpeg(ffmpeg_cmd, output_file)
            
            # Upload to storage
            print(f"[{job_id}] Uploading to storage...")
            video_url = await storage_manager.upload_video(output_file, job_id)
            
            # Cleanup
            print(f"[{job_id}] Cleaning up...")
            await self._cleanup(job_dir)
            
            print(f"[{job_id}] ✅ Composition complete!")
            return video_url
            
        except Exception as e:
            print(f"[{job_id}] ❌ Composition failed: {str(e)}")
            raise
    
    async def _download_assets(self, composition: Dict[str, Any], job_dir: Path):
        """
        Download all video and audio assets
        """
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            # Download background videos
            for i, scene in enumerate(composition['scenes']):
                if scene.get('backgroundVideoUrl'):
                    tasks.append(
                        self._download_file(
                            session,
                            scene['backgroundVideoUrl'],
                            job_dir / f"bg_{i}.mp4"
                        )
                    )
                
                # Download voiceover audios
                if scene.get('voiceoverAudioUrl'):
                    tasks.append(
                        self._download_file(
                            session,
                            scene['voiceoverAudioUrl'],
                            job_dir / f"audio_{i}.mp3"
                        )
                    )
            
            # Download music track
            if composition.get('musicTrack'):
                tasks.append(
                    self._download_file(
                        session,
                        composition['musicTrack'],
                        job_dir / "music.mp3"
                    )
                )
            
            # Execute all downloads
            await asyncio.gather(*tasks)
    
    async def _download_file(self, session, url: str, destination: Path):
        """
        Download file from URL
        """
        async with session.get(url) as response:
            if response.status == 200:
                with open(destination, 'wb') as f:
                    f.write(await response.read())
    
    def _build_ffmpeg_command(self, composition: Dict[str, Any], job_dir: Path) -> List[str]:
        """
        Build complete FFmpeg command
        """
        cmd = ['ffmpeg', '-y']  # -y to overwrite output
        
        # Input files
        input_files = []
        scene_mappings = []
        
        for i, scene in enumerate(composition['scenes']):
            bg_file = job_dir / f"bg_{i}.mp4"
            audio_file = job_dir / f"audio_{i}.mp3"
            
            if bg_file.exists():
                cmd.extend(['-i', str(bg_file)])
                scene_mappings.append({
                    'video_input': len(input_files),
                    'scene_index': i
                })
                input_files.append('video')
            
            if audio_file.exists():
                cmd.extend(['-i', str(audio_file)])
                scene_mappings.append({
                    'audio_input': len(input_files),
                    'scene_index': i
                })
                input_files.append('audio')
        
        # Add music track
        music_file = job_dir / "music.mp3"
        music_input_index = None
        if music_file.exists():
            cmd.extend(['-i', str(music_file)])
            music_input_index = len(input_files)
            input_files.append('music')
        
        # Build filter complex
        filter_complex = self._build_filter_complex(
            composition,
            scene_mappings,
            music_input_index
        )
        
        cmd.extend(['-filter_complex', filter_complex])
        
        # Output mapping
        cmd.extend(['-map', '[vout]'])
        cmd.extend(['-map', '[aout]'])
        
        # Video encoding
        cmd.extend([
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-profile:v', 'high',
            '-level', '4.0',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart'
        ])
        
        # Audio encoding
        cmd.extend([
            '-c:a', 'aac',
            '-b:a', '192k',
            '-ar', '48000'
        ])
        
        # Output file
        output_file = job_dir / f"output.{composition['outputFormat']}"
        cmd.append(str(output_file))
        
        return cmd
    
    def _build_filter_complex(
        self,
        composition: Dict[str, Any],
        scene_mappings: List[Dict[str, Any]],
        music_input_index: int = None
    ) -> str:
        """
        Build FFmpeg filter complex string
        """
        filters = []
        resolution = composition['resolution']
        
        # Process each scene
        video_streams = []
        audio_streams = []
        
        for i, scene in enumerate(composition['scenes']):
            # Find video input index
            video_input = next(
                (m['video_input'] for m in scene_mappings 
                 if m['scene_index'] == i and 'video_input' in m),
                None
            )
            
            if video_input is not None:
                # Scale and crop video
                filters.append(
                    f"[{video_input}:v]scale={resolution['width']}:{resolution['height']}:"
                    f"force_original_aspect_ratio=increase,"
                    f"crop={resolution['width']}:{resolution['height']}[v{i}_scaled]"
                )
                
                # Apply effects
                if scene.get('effects'):
                    effects_chain = self._build_effects_chain(scene['effects'])
                    filters.append(
                        f"[v{i}_scaled]{effects_chain}[v{i}_fx]"
                    )
                    current_stream = f"[v{i}_fx]"
                else:
                    current_stream = f"[v{i}_scaled]"
                
                # Add captions if enabled
                if scene.get('captions'):
                    caption_filter = self._build_caption_filter(scene['captions'], i)
                    filters.append(
                        f"{current_stream}{caption_filter}[v{i}_final]"
                    )
                    current_stream = f"[v{i}_final]"
                
                # Trim to duration
                filters.append(
                    f"{current_stream}trim=duration={scene['duration']},"
                    f"setpts=PTS-STARTPTS[v{i}]"
                )
                
                video_streams.append(f"[v{i}]")
            
            # Find audio input index
            audio_input = next(
                (m['audio_input'] for m in scene_mappings 
                 if m['scene_index'] == i and 'audio_input' in m),
                None
            )
            
            if audio_input is not None:
                # Trim audio
                filters.append(
                    f"[{audio_input}:a]atrim=duration={scene['duration']},"
                    f"asetpts=PTS-STARTPTS[a{i}]"
                )
                audio_streams.append(f"[a{i}]")
        
        # Concatenate video streams
        if len(video_streams) > 1:
            filters.append(
                f"{''.join(video_streams)}concat=n={len(video_streams)}:v=1:a=0[vconcat]"
            )
            video_out = "[vconcat]"
        elif len(video_streams) == 1:
            video_out = video_streams[0]
        else:
            raise ValueError("No video streams to process")
        
        # Concatenate audio streams
        if len(audio_streams) > 1:
            filters.append(
                f"{''.join(audio_streams)}concat=n={len(audio_streams)}:v=0:a=1[aconcat]"
            )
            audio_out = "[aconcat]"
        elif len(audio_streams) == 1:
            audio_out = audio_streams[0]
        else:
            audio_out = "anullsrc"
        
        # Mix with background music
        if music_input_index is not None:
            music_volume = composition.get('musicVolume', 0.3)
            filters.append(
                f"{audio_out}[{music_input_index}:a]amix=inputs=2:"
                f"duration=first:weights=1 {music_volume}[amixed]"
            )
            audio_out = "[amixed]"
        
        # Apply global effects
        if composition.get('globalEffects'):
            global_fx = self._build_effects_chain(composition['globalEffects'])
            filters.append(f"{video_out}{global_fx}[vfinal]")
            video_out = "[vfinal]"
        
        # Final output streams
        filters.append(f"{video_out}copy[vout]")
        filters.append(f"{audio_out}acopy[aout]")
        
        return ';'.join(filters)
    
    def _build_effects_chain(self, effects: List[str]) -> str:
        """
        Build effects filter chain
        """
        effect_filters = []
        
        for effect in effects:
            if effect == 'vignette':
                effect_filters.append('vignette=angle=PI/4')
            elif effect == 'film-grain':
                effect_filters.append('noise=c0s=20:allf=t')
            elif effect == 'blur':
                effect_filters.append('boxblur=2:1')
            elif effect == 'sharpen':
                effect_filters.append('unsharp=5:5:1.0:5:5:0.0')
            elif effect == 'color-grading':
                effect_filters.append('eq=contrast=1.1:brightness=0.05:saturation=1.2')
            elif effect == 'chromatic-aberration':
                effect_filters.append('chromashift=crh=3:cbh=-3')
            elif effect == 'glow':
                effect_filters.append('gblur=sigma=10')
            elif effect == 'scanlines':
                effect_filters.append('interlace')
        
        return ','.join(effect_filters) if effect_filters else ''
    
    def _build_caption_filter(self, captions: Dict[str, Any], scene_index: int) -> str:
        """
        Build caption drawtext filter
        """
        style = captions['style']
        text = captions['text'].replace("'", "\\'").replace(':', '\\:')
        
        # Position mapping
        positions = {
            'top': '(w-text_w)/2:h*0.1',
            'center': '(w-text_w)/2:(h-text_h)/2',
            'bottom': '(w-text_w)/2:h*0.85'
        }
        position = positions.get(captions['position'], positions['bottom'])
        
        filter_parts = [
            f"drawtext=text='{text}'",
            f"fontfile=/usr/share/fonts/truetype/{style['fontFamily']}.ttf",
            f"fontsize={style['fontSize']}",
            f"fontcolor={style['color']}",
            f"x={position}",
            f"borderw={style.get('strokeWidth', 0)}",
            f"bordercolor={style.get('strokeColor', '0x000000')}"
        ]
        
        # Add background box if specified
        if style.get('backgroundColor'):
            filter_parts.extend([
                f"box=1",
                f"boxcolor={style['backgroundColor']}",
                f"boxborderw=10"
            ])
        
        # Add shadow
        if style.get('shadow'):
            shadow = style['shadow']
            filter_parts.extend([
                f"shadowx={shadow['x']}",
                f"shadowy={shadow['y']}",
                f"shadowcolor={shadow['color']}"
            ])
        
        return ','.join(filter_parts)
    
    async def _execute_ffmpeg(self, cmd: List[str], output_file: Path):
        """
        Execute FFmpeg command
        """
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            error_msg = stderr.decode()
            raise Exception(f"FFmpeg failed: {error_msg}")
        
        if not output_file.exists():
            raise Exception("Output file was not created")
    
    async def _cleanup(self, job_dir: Path):
        """
        Clean up temporary files
        """
        import shutil
        try:
            shutil.rmtree(job_dir)
        except Exception as e:
            print(f"Cleanup warning: {str(e)}")
    
    async def optimize_for_platform(
        self,
        video_url: str,
        platform: str,
        quality: str,
        job_id: str
    ) -> str:
        """
        Optimize video for specific platform
        """
        # Platform-specific optimization settings
        settings = {
            'tiktok': {
                'resolution': {'width': 1080, 'height': 1920},
                'max_duration': 180,
                'bitrate': '3000k'
            },
            'youtube': {
                'resolution': {'width': 1080, 'height': 1920},
                'max_duration': 60,
                'bitrate': '5000k'
            },
            'instagram': {
                'resolution': {'width': 1080, 'height': 1920},
                'max_duration': 90,
                'bitrate': '3500k'
            }
        }
        
        platform_settings = settings.get(platform, settings['tiktok'])
        
        # Download original
        job_dir = self.temp_dir / job_id
        job_dir.mkdir(exist_ok=True)
        
        input_file = job_dir / "input.mp4"
        output_file = job_dir / "optimized.mp4"
        
        # Download
        import aiohttp
        async with aiohttp.ClientSession() as session:
            await self._download_file(session, video_url, input_file)
        
        # Optimize
        cmd = [
            'ffmpeg', '-y',
            '-i', str(input_file),
            '-vf', f"scale={platform_settings['resolution']['width']}:{platform_settings['resolution']['height']}",
            '-c:v', 'libx264',
            '-b:v', platform_settings['bitrate'],
            '-c:a', 'aac',
            '-b:a', '192k',
            '-movflags', '+faststart',
            str(output_file)
        ]
        
        await self._execute_ffmpeg(cmd, output_file)
        
        # Upload
        optimized_url = await storage_manager.upload_video(output_file, f"{job_id}_optimized")
        
        # Cleanup
        await self._cleanup(job_dir)
        
        return optimized_url
    
    async def generate_thumbnail(self, video_url: str, timestamp: int) -> str:
        """
        Generate thumbnail from video
        """
        job_id = f"thumb_{uuid.uuid4().hex}"
        job_dir = self.temp_dir / job_id
        job_dir.mkdir(exist_ok=True)
        
        input_file = job_dir / "input.mp4"
        output_file = job_dir / "thumbnail.jpg"
        
        # Download video
        import aiohttp
        async with aiohttp.ClientSession() as session:
            await self._download_file(session, video_url, input_file)
        
        # Extract frame
        cmd = [
            'ffmpeg', '-y',
            '-i', str(input_file),
            '-ss', str(timestamp),
            '-vframes', '1',
            '-q:v', '2',
            str(output_file)
        ]
        
        await self._execute_ffmpeg(cmd, output_file)
        
        # Upload
        thumbnail_url = await storage_manager.upload_image(output_file, job_id)
        
        # Cleanup
        await self._cleanup(job_dir)
        
        return thumbnail_url
    
    async def get_metadata(self, video_url: str) -> Dict[str, Any]:
        """
        Get video metadata using ffprobe
        """
        job_id = f"meta_{uuid.uuid4().hex}"
        job_dir = self.temp_dir / job_id
        job_dir.mkdir(exist_ok=True)
        
        input_file = job_dir / "input.mp4"
        
        # Download video
        import aiohttp
        async with aiohttp.ClientSession() as session:
            await self._download_file(session, video_url, input_file)
        
        # Get metadata
        cmd = [
            'ffprobe',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            str(input_file)
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"ffprobe failed: {stderr.decode()}")
        
        metadata = json.loads(stdout.decode())
        
        # Extract relevant info
        video_stream = next(
            (s for s in metadata['streams'] if s['codec_type'] == 'video'),
            None
        )
        
        result = {
            'duration': float(metadata['format']['duration']),
            'width': video_stream['width'] if video_stream else 0,
            'height': video_stream['height'] if video_stream else 0,
            'fps': eval(video_stream['r_frame_rate']) if video_stream else 0,
            'bitrate': int(metadata['format']['bit_rate']),
            'codec': video_stream['codec_name'] if video_stream else 'unknown',
            'fileSize': int(metadata['format']['size'])
        }
        
        # Cleanup
        await self._cleanup(job_dir)
        
        return result
    
    async def process_generation(self, job_id: str, request: Any):
        """
        Process complete video generation from template
        """
        # This would integrate with the template engine
        # For now, placeholder
        pass
