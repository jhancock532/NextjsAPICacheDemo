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

After an initial simulated slow request of two seconds, middleware then takes about 4.5ms to query the API endpoint and get a response. This value is for when it's run during a production build of the site, using development mode this time is around 6-7ms. The total cached page load time is about 28ms.