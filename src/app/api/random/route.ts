import { NextResponse } from 'next/server';

let requestCount = 0;

export async function GET() {
  const requestId = ++requestCount;
  const start = performance.now();
  
  try {
    const randomValue = Math.random();
    const end = performance.now();
    const processingTime = end - start;
    
    // Log timing info to terminal
    console.log(`[Request #${requestId}] Random API response time: ${processingTime.toFixed(1)}ms`);
    
    return NextResponse.json({ 
      value: randomValue,
      metrics: {
        requestId,
        processingTime: `${processingTime.toFixed(1)}ms`,
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        // Cache for 5 seconds, allow serving stale for 2 seconds while revalidating
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=2'
      }
    });
  } catch (error) {
    const end = performance.now();
    console.error(`[Request #${requestId}] Failed after ${(end - start).toFixed(1)}ms:`, error);
    return NextResponse.json({ error: 'Failed to generate random number' }, { status: 500 });
  }
} 