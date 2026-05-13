import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
  });

  client.on('connect', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Redis] Connected');
    }
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// ── Rate Limiting Helpers ────────────────────────────────
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    await redis.connect().catch(() => {});
    
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    pipeline.zadd(key, now.toString(), `${now}-${Math.random()}`);
    pipeline.pexpire(key, windowMs);

    const results = await pipeline.exec();
    const currentCount = (results?.[1]?.[1] as number) || 0;

    return {
      allowed: currentCount < maxRequests,
      remaining: Math.max(0, maxRequests - currentCount - 1),
      resetAt: now + windowMs,
    };
  } catch {
    // If Redis is down, allow the request (fail open for development)
    console.warn('[Redis] Rate limit check failed, allowing request');
    return { allowed: true, remaining: maxRequests, resetAt: now + windowMs };
  }
}

// ── Cache Helpers ────────────────────────────────────────
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    await redis.connect().catch(() => {});
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = 300
): Promise<void> {
  try {
    await redis.connect().catch(() => {});
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    console.warn('[Redis] Cache set failed');
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.connect().catch(() => {});
    await redis.del(key);
  } catch {
    console.warn('[Redis] Cache delete failed');
  }
}

export default redis;
