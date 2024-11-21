async function loadTest() {
  const NUM_REQUESTS = 10;
  console.log(`Starting load test with ${NUM_REQUESTS} sequential requests...\n`);
  
  const start = performance.now();
  const results = [];
  
  // Run requests sequentially
  for (let i = 0; i < NUM_REQUESTS; i++) {
    const requestStart = performance.now();
    const response = await fetch('http://localhost:3000/api/random');
    const data = await response.json();
    const requestEnd = performance.now();
    
    const result = {
      requestNumber: i + 1,
      time: requestEnd - requestStart,
      data
    };
    
    results.push(result);
    
    // Log each request immediately
    console.log(`Request #${result.requestNumber}: ${result.time.toFixed(1)}ms`);
    
    // Optional: Add a small delay between requests to make logs more readable
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const end = performance.now();
  
  const avgTime = results.reduce((acc, curr) => acc + curr.time, 0) / results.length;
  console.log('\nSummary:');
  console.log(`Total time: ${(end - start).toFixed(1)}ms`);
  console.log(`Average response time: ${avgTime.toFixed(1)}ms`);
  
  // Additional cache analysis
  const fastRequests = results.filter(r => r.time < 100).length;
  console.log(`Likely cache hits: ${fastRequests} (${((fastRequests/NUM_REQUESTS) * 100).toFixed(1)}%)`);
}

// Run the test
loadTest().catch(console.error); 