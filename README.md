## Getting Started

First, run the development server:

```bash
fnm use
npm install
npm run dev
```

Open [http://localhost:3000/metadata-test](http://localhost:3000/metadata-test) with your browser to see the result.

Alternatively, run the basic API response time test in a new terminal:

```bash
npx tsx src/app/api/random/load-test.ts
```

## Findings

```
Starting load test with 10 sequential requests...

Request #1: 168.6ms
Request #2: 24.2ms
Request #3: 23.2ms
Request #4: 24.4ms
Request #5: 24.2ms
Request #6: 22.4ms
Request #7: 22.8ms
Request #8: 27.0ms
Request #9: 22.7ms
Request #10: 22.3ms
```

This is the result against a very simple Next.js API endpoint with a random number generator.

Our cache endpoint takes 35ms to 50ms to respond - so there is opportunity to improve this.

## Express Cache Demo

This is the same API endpoint but implemented in Express.js

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

