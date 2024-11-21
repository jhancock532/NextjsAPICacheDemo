import express from 'express';
import { Request, Response } from 'express';
import apicache from 'apicache';

const app = express();
const cache = apicache.middleware;
const port = 3001;

// Initialize cache
const cacheInstance = apicache.options({
  debug: true,
  statusCodes: { include: [200] }
}).middleware;

// Counter for tracking requests
let requestCount = 0;

// Random number API route with cache
app.get('/api/random', 
  cacheInstance('5 seconds'), // Cache for 5 seconds
  async (req: Request, res: Response) => {
    const requestId = ++requestCount;
    const start = performance.now();

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const randomValue = Math.random();
      const end = performance.now();
      const processingTime = end - start;

      // Log timing info to terminal
      console.log(`[Request #${requestId}] Express API response time: ${processingTime.toFixed(1)}ms`);

      res.json({
        value: randomValue,
        metrics: {
          requestId,
          processingTime: `${processingTime.toFixed(1)}ms`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      const end = performance.now();
      console.error(`[Request #${requestId}] Failed after ${(end - start).toFixed(1)}ms:`, error);
      res.status(500).json({ error: 'Failed to generate random number' });
    }
  }
);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
}); 