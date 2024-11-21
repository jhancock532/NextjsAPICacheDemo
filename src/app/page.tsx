'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const start = performance.now();
      const response = await fetch('/api/data');
      const data = await response.json();
      const end = performance.now();
      
      setResults(prev => [{
        ...data,
        clientTiming: `${(end - start).toFixed(1)}ms`
      }, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cache Testing Dashboard</h1>
      
      <div className="mb-6">
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-bold">Request {index + 1}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Client-side timing: {result.clientTiming}</div>
              <div>Server-side timing: {result.metrics.thisRequestTime}</div>
              <div>Cache hit rate: {result.metrics.cacheHitRate}</div>
              <div>Total requests: {result.metrics.totalRequests}</div>
              <div>Value: {result.data.value}</div>
              <div>Timestamp: {result.data.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
