import json
import redis
from typing import Any, Optional
from app.core.config import settings

# Redis client singleton
redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True
)


def get_redis() -> redis.Redis:
    return redis_client


def set_cache(key: str, value: Any, ttl: int = 300) -> bool:
    """Set cache with TTL in seconds."""
    try:
        redis_client.setex(key, ttl, json.dumps(value))
        return True
    except Exception as e:
        print(f"Cache set error: {e}")
        return False


def get_cache(key: str) -> Optional[Any]:
    """Get cached value."""
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        print(f"Cache get error: {e}")
        return None


def delete_cache(key: str) -> bool:
    """Delete a cache key."""
    try:
        redis_client.delete(key)
        return True
    except Exception as e:
        print(f"Cache delete error: {e}")
        return False


def clear_pattern(pattern: str) -> int:
    """Delete all keys matching pattern."""
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
        return len(keys)
    except Exception as e:
        print(f"Cache clear error: {e}")
        return 0


def cache_key(*args) -> str:
    """Build a cache key from arguments."""
    return ":".join(str(a) for a in args)