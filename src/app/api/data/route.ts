import { NextResponse } from 'next/server';
import { apiCache } from '@/lib/cache-handler';

let requestCount = 0;
let cacheHits = 0;
let totalProcessingTime = 0;

async function simulateExpensiveOperation() {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
  return {
    timestamp: new Date().toISOString(),
    value: Math.random()
  };
}

export async function GET() {
  const requestId = ++requestCount;
  const start = performance.now();
  
  try {
    const data = await apiCache.get(
      'test-data',
      async () => {
        const result = await simulateExpensiveOperation();
        return {
          ...result,
          fromCache: false,
          requestId
        };
      },
      {
        ttl: 5, // Cache for 5 seconds
        staleWhileRevalidate: 2
      }
    );

    const end = performance.now();
    const processingTime = end - start;
    totalProcessingTime += processingTime;

    // If processing time is very short, it was likely a cache hit
    if (processingTime < 100) cacheHits++;

    const metrics = {
      totalRequests: requestCount,
      cacheHits,
      cacheHitRate: `${((cacheHits / requestCount) * 100).toFixed(1)}%`,
      avgProcessingTime: `${(totalProcessingTime / requestCount).toFixed(1)}ms`,
      thisRequestTime: `${processingTime.toFixed(1)}ms`
    };

    return NextResponse.json({ data, metrics }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=2'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 