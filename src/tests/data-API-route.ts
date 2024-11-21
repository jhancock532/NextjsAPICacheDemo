async function loadDataAPIRouteTest() {
  const NUM_REQUESTS = 10;
  console.log(`Starting data API load test with ${NUM_REQUESTS} sequential requests...\n`);
  
  const start = performance.now();
  const results = [];
  
  // Run requests sequentially
  for (let i = 0; i < NUM_REQUESTS; i++) {
    const requestStart = performance.now();
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    const requestEnd = performance.now();
    
    const result = {
      requestNumber: i + 1,
      time: requestEnd - requestStart,
      data
    };
    
    results.push(result);
    
    // Log each request immediately with more detailed metrics
    console.log(`Request #${result.requestNumber}: ${result.time.toFixed(1)}ms`);
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const end = performance.now();
  
  const avgTime = results.reduce((acc, curr) => acc + curr.time, 0) / results.length;
  console.log('\nSummary:');
  console.log(`Total time: ${(end - start).toFixed(1)}ms`);
  console.log(`Average response time: ${avgTime.toFixed(1)}ms`);
  
  // Cache analysis
  const fastRequests = results.filter(r => r.time < 100).length;
  console.log(`Likely cache hits: ${fastRequests} (${((fastRequests/NUM_REQUESTS) * 100).toFixed(1)}%)`);
  
  // Additional metrics from the last request
  const lastMetrics = results[results.length - 1].data.metrics;
  console.log(`\nServer-side metrics:`);
  console.log(`Total requests processed: ${lastMetrics.totalRequests}`);
  console.log(`Server cache hits: ${lastMetrics.cacheHits}`);
  console.log(`Average processing time: ${lastMetrics.avgProcessingTime}`);
}

// Run the test
loadDataAPIRouteTest().catch(console.error); 
