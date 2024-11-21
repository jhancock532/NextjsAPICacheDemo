'use client';

import { useEffect, useState } from 'react';

type RequestData = {
  timestamp: string;
  data: any;
  middleware: {
    timing: string;
    timestamp: string;
  };
  metrics: {
    totalRequests: number;
    cacheHits: number;
    cacheHitRate: string;
    thisRequestTime: string;
  };
  pageLoadTime?: string;
};

// Utility functions for localStorage handling
const STORAGE_KEY = 'middleware-test-requests';

const getStoredRequests = (): RequestData[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const storeRequests = (requests: RequestData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export default function MiddlewareTest() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  // Load stored requests on initial render
  useEffect(() => {
    setRequests(getStoredRequests());
  }, []);

  useEffect(() => {
    // Get and parse headers from meta tag
    const headerContent = document.querySelector('meta[name="headers"]')?.getAttribute('content');
    if (!headerContent) return;

    // Parse headers string into object
    const headerObj = headerContent.split('|').reduce((acc, curr) => {
      const [key, value] = curr.split(':');
      if (key && value) {
        acc[key.toLowerCase()] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    const encodedData = headerObj['x-middleware-cache-data'];
    
    if (encodedData) {
      try {
        // Decode the base64 data
        const decodedData = atob(encodedData);
        const data = JSON.parse(decodedData);
        
        const newRequest = {
          ...data,
          pageLoadTime: new Date().toISOString()
        };

        // Update requests and store in localStorage
        setRequests(prev => {
          const updated = [newRequest, ...prev].slice(0, 10);
          storeRequests(updated);
          return updated;
        });
        
        setLastRefresh(new Date().toISOString());
      } catch (error) {
        console.error('Error parsing middleware data:', error);
      }
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRequests([]);
  };

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">Middleware Cache Testing</h1>
        
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg 
                     font-semibold shadow-md transition-colors duration-200"
          >
            Refresh Page
          </button>

          <button
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg 
                     font-semibold shadow-md transition-colors duration-200"
          >
            Clear History
          </button>
          
          <div className="text-sm text-gray-600">
            Last refresh: <span className="font-mono">{lastRefresh}</span>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-gray-600">
            No requests recorded yet. Click refresh to start testing.
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100">
                  <h3 className="font-bold text-indigo-800">Page Load {index + 1}</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="text-purple-800 font-semibold">Middleware Timing:</span>
                      <span className="ml-2 font-mono text-purple-900">{request.middleware.timing}</span>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-blue-800 font-semibold">Server Timing:</span>
                      <span className="ml-2 font-mono text-blue-900">{request.metrics.thisRequestTime}</span>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="text-green-800 font-semibold">Cache Hit Rate:</span>
                      <span className="ml-2 font-mono text-green-900">{request.metrics.cacheHitRate}</span>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <span className="text-yellow-800 font-semibold">Total Requests:</span>
                      <span className="ml-2 font-mono text-yellow-900">{request.metrics.totalRequests}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-gray-600 text-sm">API Time</div>
                          <div className="font-mono text-gray-800">{request.data.timestamp}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm">Middleware Time</div>
                          <div className="font-mono text-gray-800">{request.middleware.timestamp}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm">Page Load Time</div>
                          <div className="font-mono text-gray-800">{request.pageLoadTime}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <span className="text-orange-800 font-semibold">Random Value:</span>
                      <span className="ml-2 font-mono text-orange-900">{request.data.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How to test:</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Click the Refresh button or refresh the page manually</li>
            <li>First load will take ~2 seconds (simulated API delay)</li>
            <li>Refresh within 5 seconds to see cached response (fast)</li>
            <li>Wait 5-7 seconds to see stale-while-revalidate behavior</li>
            <li>Wait {'>'} 7 seconds to see a fresh request (slow again)</li>
          </ol>
        </div>
      </div>
    </main>
  );
} 