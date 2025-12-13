"""
VIRAL ENGINE PRO - TREND ANALYZER
AI-powered viral trend detection and analysis
Built: December 13, 2025
Company: RJ Business Solutions
"""

import os
from typing import List, Dict, Any, Optional
import anthropic
import asyncio
import aiohttp
from datetime import datetime, timedelta

class TrendAnalyzer:
    def __init__(self):
        self.anthropic_client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        self.firecrawl_api_key = os.getenv('FIRECRAWL_API_KEY')
    
    async def analyze(
        self,
        platform: str = 'tiktok',
        niche: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Analyze current viral trends
        """
        try:
            # Scrape trending content
            trending_data = await self._scrape_trending(platform, niche)
            
            # Analyze with AI
            trends = await self._analyze_with_ai(trending_data, platform, niche)
            
            # Rank and filter
            ranked_trends = self._rank_trends(trends)
            
            return ranked_trends[:limit]
        except Exception as e:
            print(f"Trend analysis error: {str(e)}")
            return []
    
    async def _scrape_trending(
        self,
        platform: str,
        niche: Optional[str]
    ) -> Dict[str, Any]:
        """
        Scrape trending content using Firecrawl
        """
        try:
            urls = {
                'tiktok': 'https://www.tiktok.com/trending',
                'youtube': 'https://www.youtube.com/feed/trending',
                'instagram': 'https://www.instagram.com/explore/trending/'
            }
            
            target_url = urls.get(platform, urls['tiktok'])
            
            # Use Firecrawl to scrape
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    'https://api.firecrawl.dev/v0/scrape',
                    headers={
                        'Authorization': f'Bearer {self.firecrawl_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'url': target_url,
                        'formats': ['markdown', 'html']
                    }
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        print(f"Firecrawl error: {response.status}")
                        return {}
        except Exception as e:
            print(f"Scraping error: {str(e)}")
            return {}
    
    async def _analyze_with_ai(
        self,
        trending_data: Dict[str, Any],
        platform: str,
        niche: Optional[str]
    ) -> List[Dict[str, Any]]:
        """
        Analyze trending data with Claude
        """
        try:
            content = trending_data.get('markdown', '')
            
            system_prompt = f"""You are a viral content trend analyst specializing in {platform}.
Your job is to analyze trending content and identify patterns, topics, and opportunities for viral videos.

Focus on:
1. Emerging topics with high engagement
2. Content formats that are working
3. Viral hooks and themes
4. Hashtag trends
5. Audio/music trends
6. Visual styles
7. Viral challenges

{f"Specific niche: {niche}" if niche else ""}

Output a JSON array of trend objects with this structure:
[
  {{
    "topic": "topic name",
    "score": <1-100 viral potential score>,
    "category": "category",
    "keywords": ["keyword1", "keyword2"],
    "hook_examples": ["hook1", "hook2"],
    "why_viral": "explanation",
    "competition_level": "low|medium|high",
    "recommended_templates": ["template_id1", "template_id2"]
  }}
]"""

            response = self.anthropic_client.messages.create(
                model='claude-sonnet-4-20250514',
                max_tokens=4000,
                temperature=0.7,
                system=system_prompt,
                messages=[
                    {
                        'role': 'user',
                        'content': f'Analyze these trending topics and extract viral opportunities:\n\n{content[:10000]}'
                    }
                ]
            )
            
            # Extract JSON from response
            content_block = response.content[0]
            if content_block.type == 'text':
                import json
                import re
                
                # Extract JSON array from response
                json_match = re.search(r'\[.*\]', content_block.text, re.DOTALL)
                if json_match:
                    trends = json.loads(json_match.group())
                    return trends
            
            return []
        except Exception as e:
            print(f"AI analysis error: {str(e)}")
            return []
    
    def _rank_trends(self, trends: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Rank trends by viral potential
        """
        # Sort by score
        ranked = sorted(trends, key=lambda x: x.get('score', 0), reverse=True)
        
        # Add ranking
        for i, trend in enumerate(ranked):
            trend['rank'] = i + 1
        
        return ranked
    
    async def get_suggestions(
        self,
        template_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get AI-powered trend suggestions
        """
        try:
            # Analyze multiple platforms
            platforms = ['tiktok', 'youtube', 'instagram']
            
            all_trends = []
            tasks = [self.analyze(platform=p, limit=5) for p in platforms]
            results = await asyncio.gather(*tasks)
            
            for trends in results:
                all_trends.extend(trends)
            
            # Deduplicate and rank
            unique_trends = self._deduplicate_trends(all_trends)
            
            # Filter by template if specified
            if template_id:
                unique_trends = [
                    t for t in unique_trends
                    if template_id in t.get('recommended_templates', [])
                ]
            
            return unique_trends[:15]
        except Exception as e:
            print(f"Get suggestions error: {str(e)}")
            return []
    
    def _deduplicate_trends(self, trends: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Deduplicate trends by topic similarity
        """
        unique = []
        seen_topics = set()
        
        for trend in trends:
            topic = trend.get('topic', '').lower()
            
            # Check if similar topic already exists
            is_duplicate = False
            for seen in seen_topics:
                if self._calculate_similarity(topic, seen) > 0.7:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique.append(trend)
                seen_topics.add(topic)
        
        return unique
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate text similarity (simple implementation)
        """
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        if len(union) == 0:
            return 0.0
        
        return len(intersection) / len(union)
    
    async def analyze_video_performance(
        self,
        video_id: str,
        platform: str
    ) -> Dict[str, Any]:
        """
        Analyze video performance and predict viral potential
        """
        try:
            # Fetch video metrics
            metrics = await self._fetch_video_metrics(video_id, platform)
            
            # Analyze with AI
            analysis = await self._analyze_performance_with_ai(metrics)
            
            return analysis
        except Exception as e:
            print(f"Performance analysis error: {str(e)}")
            return {}
    
    async def _fetch_video_metrics(
        self,
        video_id: str,
        platform: str
    ) -> Dict[str, Any]:
        """
        Fetch video metrics from platform
        """
        # Placeholder - would integrate with actual platform APIs
        return {
            'views': 0,
            'likes': 0,
            'comments': 0,
            'shares': 0,
            'engagement_rate': 0.0,
            'watch_time': 0,
            'completion_rate': 0.0
        }
    
    async def _analyze_performance_with_ai(
        self,
        metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyze performance metrics with AI
        """
        try:
            system_prompt = """You are a viral video performance analyst.
Analyze these metrics and provide insights on viral potential, strengths, weaknesses, and recommendations.

Output JSON format:
{
  "viral_score": <0-100>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["rec1", "rec2"],
  "predicted_reach": <estimated final reach>,
  "optimization_tips": ["tip1", "tip2"]
}"""

            response = self.anthropic_client.messages.create(
                model='claude-sonnet-4-20250514',
                max_tokens=2000,
                temperature=0.5,
                system=system_prompt,
                messages=[
                    {
                        'role': 'user',
                        'content': f'Analyze these video metrics:\n{metrics}'
                    }
                ]
            )
            
            content_block = response.content[0]
            if content_block.type == 'text':
                import json
                import re
                
                json_match = re.search(r'\{.*\}', content_block.text, re.DOTALL)
                if json_match:
                    analysis = json.loads(json_match.group())
                    return analysis
            
            return {}
        except Exception as e:
            print(f"AI performance analysis error: {str(e)}")
            return {}
    
    async def get_optimal_posting_time(
        self,
        platform: str,
        target_audience: str = 'gen_z'
    ) -> Dict[str, Any]:
        """
        Calculate optimal posting time
        """
        # Optimal posting times by platform and audience
        times = {
            'tiktok': {
                'gen_z': ['09:00', '12:00', '19:00'],
                'millennial': ['07:00', '12:00', '21:00'],
                'gen_x': ['08:00', '13:00', '20:00']
            },
            'youtube': {
                'gen_z': ['14:00', '20:00', '22:00'],
                'millennial': ['12:00', '19:00', '21:00'],
                'gen_x': ['08:00', '12:00', '20:00']
            },
            'instagram': {
                'gen_z': ['11:00', '15:00', '21:00'],
                'millennial': ['09:00', '13:00', '20:00'],
                'gen_x': ['08:00', '12:00', '19:00']
            }
        }
        
        optimal_times = times.get(platform, {}).get(target_audience, ['12:00', '19:00'])
        
        # Calculate next optimal time
        now = datetime.now()
        next_times = []
        
        for time_str in optimal_times:
            hour, minute = map(int, time_str.split(':'))
            target_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            if target_time < now:
                # Move to next day
                target_time += timedelta(days=1)
            
            next_times.append({
                'time': target_time.isoformat(),
                'in_hours': (target_time - now).total_seconds() / 3600
            })
        
        # Sort by soonest
        next_times.sort(key=lambda x: x['in_hours'])
        
        return {
            'recommended': next_times[0]['time'],
            'all_optimal_times': next_times,
            'timezone': 'UTC'
        }
