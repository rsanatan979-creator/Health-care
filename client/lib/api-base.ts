// This file prepends VITE_API_URL to any relative `/api/...` fetch request
const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

if (API_BASE) {
  const originalFetch = window.fetch.bind(window);
  (window as any).fetch = (input: RequestInfo, init?: RequestInit) => {
    try {
      if (typeof input === 'string') {
        if (input.startsWith('/api')) {
          return originalFetch(API_BASE + input, init);
        }
        // handle root-relative calls to /api when base present
        if (input.startsWith('api')) {
          return originalFetch(API_BASE + '/' + input, init);
        }
      } else if (input instanceof Request) {
        const url = input.url;
        if (url.startsWith('/api')) {
          const newReq = new Request(API_BASE + url, input);
          return originalFetch(newReq, init);
        }
      }
    } catch (e) {
      // fallback to original fetch on error
    }
    return originalFetch(input as any, init);
  };
}
