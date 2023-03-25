import LRU from "lru-cache";

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
    max: options?.uniqueTokenPerInterval || 500,
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
      const isLimitExceeded = currentUsage >= limit;

      const responseHeaders: HeadersInit = {
        "X-RateLimit-Limit": `${limit}`,
        "X-RateLimit-Remaining": `${
          isLimitExceeded ? 0 : limit - currentUsage
        }`,
        "X-RateLimit-Reset": `${Date.now() + 60000}`,
      };

      return { isLimitExceeded, responseHeaders };
    },
  };
}
