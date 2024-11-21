## Getting Started

Compile and run the Next.js app:

```bash
fnm use
npm install
npm run build
npm start
```

Open [http://localhost:3000/metadata-test](http://localhost:3000/metadata-test) with your browser to see the demo of a cached API response being accessed via middleware when loading a page.

## Findings

Middleware takes about 4.5ms to query the API endpoint and get a response (when run during a production build of the site, using development this is around 6-7ms.) The total page load time is about 28ms. 


## Basic tests for isolated API endpoint caching

### Testing the Next.js API endpoint

The script sends 10 requests to the Next.js API endpoint when takes 2 seconds to load its first request, and then caches the result for subsequent requests - we use a cache control header of 5 seconds which actually means we avoid reloading the data from the local in-memory cache.

Implementing an in-memory cache in the API endpoint won't be necessary if you are only loading one consistent item of data per API endpoint - you can just use the headers to control caching.

```
npm run test:next
```

```
Request #1: 2048.5ms
Request #2: 2.9ms
Request #3: 3.7ms
Request #4: 7.1ms
Request #5: 2.7ms
Request #6: 2.7ms
Request #7: 3.0ms
Request #8: 4.6ms
Request #9: 10.3ms
Request #10: 9.8ms
```


## Testing the Express API endpoint

This is a similar API endpoint but implemented in an Express app

```
cd express-cache-demo
npm install
npm start
```

In a new terminal, run the test script:

```
npm run test
```

```
Starting Express API load test with 10 sequential requests...

Request #1: 552.6ms
Request #2: 2.9ms
Request #3: 2.2ms
Request #4: 3.7ms
Request #5: 5.2ms
Request #6: 4.9ms
Request #7: 5.9ms
Request #8: 6.0ms
Request #9: 7.8ms
Request #10: 6.0ms
```

