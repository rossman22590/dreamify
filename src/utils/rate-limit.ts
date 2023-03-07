import type { NextApiResponse } from "next";
import LRU from "lru-cache";
import { NextResponse } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

/**
 * @name rateLimit
 * @description Rate limit middleware for Next.js API routes
 * @param options
 * @returns
 */
export default function rateLimit(options?: Options) {
  const tokenCache = new LRU({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 users per second
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token = "CACHE_TOKEN") => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;

      const responseHeaders: HeadersInit = {
        "X-RateLimit-Limit": `${limit}`,
        "X-RateLimit-Remaining": `${isRateLimited ? 0 : limit - currentUsage}`,
        "X-RateLimit-Reset": `${Date.now() + 60000}`,
      };

      if (isRateLimited) {
        return { isLimitExceeded: true, responseHeaders };
      } else {
        return { isLimitExceeded: false, responseHeaders };
      }
    },
  };
}
