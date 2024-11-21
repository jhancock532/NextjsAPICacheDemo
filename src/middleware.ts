import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only intercept requests to our test page
  if (!request.nextUrl.pathname.startsWith('/middleware-test')) {
    return NextResponse.next();
  }

  const start = performance.now();
  
  try {
    // Make request to internal API route
    const response = await fetch(`${request.nextUrl.origin}/api/data`);
    const data = await response.json();
    
    const end = performance.now();
    const middlewareTime = end - start;

    // Clone the response and add timing headers
    const enhancedData = {
      ...data,
      middleware: {
        timing: `${middlewareTime.toFixed(1)}ms`,
        timestamp: new Date().toISOString()
      }
    };

    // Create a response with the enhanced data
    const middlewareResponse = NextResponse.next();
    
    // Set the data in a header (encoded as base64 to handle special characters)
    const encodedData = Buffer.from(JSON.stringify(enhancedData)).toString('base64');
    middlewareResponse.headers.set('x-middleware-cache-data', encodedData);
    middlewareResponse.headers.set('x-middleware-timing', `${middlewareTime.toFixed(1)}`);

    return middlewareResponse;
  } catch (error) {
    console.error('Middleware request failed:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/middleware-test'
}; 