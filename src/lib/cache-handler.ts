type CacheOptions = {
  ttl: number;  // Time to live in seconds
  staleWhileRevalidate?: number;
};

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class CacheHandler {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  async get<T>(
    key: string,
    fetchData: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // If we have a valid cache entry, return it
    if (cached) {
      const age = (now - cached.timestamp) / 1000; // Convert to seconds
      
      if (age < options.ttl) {
        return cached.data;
      }

      // Check stale-while-revalidate
      if (options.staleWhileRevalidate && age < (options.ttl + options.staleWhileRevalidate)) {
        // Revalidate in background
        this.revalidateData(key, fetchData, options);
        return cached.data;
      }
    }

    // If no cache or cache is expired, fetch new data
    return this.revalidateData(key, fetchData, options);
  }

  private async revalidateData<T>(
    key: string,
    fetchData: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    const data = await fetchData();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    return data;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new CacheHandler(); 