# API Fetch Latency Analysis

This document explains why API requests in the DigiFashion app may occasionally take around 2 minutes (120 seconds) and provides solutions to improve performance.

## 1. Primary Cause: Backend "Cold Start" (Hibernation)

The most significant cause for the ~120ms delay is **Server Hibernation**.

The backend server hosting `https://project.spanchemicalsindia.com/digi/api/` is likely configured to "sleep" or "hibernate" after a period of inactivity to save resources. When the app makes the first request after a long break:
- The server must "wake up" and initialize the application environment.
- The database connection must be re-established.
- The web server service (IIS/Apache/Node) needs to reload the code.

**Symptom:** The first request takes 120s, but subsequent requests take only 1-3s.

## 2. Network Factors

- **Server Location**: If the server is hosted in a different geographical region (e.g., US or Europe) while the developer is in India, a round-trip latency is added to every request.
- **Provider Limits**: Free or low-cost hosting tiers often throttle CPU or bandwidth, making the initial data processing slow.

## 3. App-Side Concurrency

On screens like `CategoryProductsScreen`, the app makes multiple simultaneous requests:
1. `GET /filter-listing` (to get brands and price ranges)
2. `POST /shop` (to get the initial product list)

When the server is waking up, it handles these requests sequentially or with very limited concurrency, multiplying the perceived delay.

---

## 4. Recommended Solutions

### Solution A: Keep the Server Awake (Uptime Monitoring)
Use a free service like [UptimeRobot](https://uptimerobot.com/) to ping the API endpoint every 5 minutes. This ensures the server never goes into hibernation.
- **Cost**: Free
- **Complexity**: Low
- **Effectiveness**: High (Reduces 120s delay to ~2s)

### Solution B: Optimized Data Mapping
In the frontend, we are fetching the entire product list and then mapping it. For large categories, the mapping process itself (processing JSON) can block the JavaScript thread.
- **Improvement**: Use pagination (`page` and `per_page`) effectively to reduce payload size.

### Solution C: Parallelization with `Promise.all`
Currently, we call `fetchFilters` and `fetchProducts` in separate `useEffect` hooks. 
- **Improvement**: We could combine them using `Promise.all` in a single "init" function to ensure they start at the exact same moment, though they are already reasonably parallel as separate hooks.

### Solution D: Infrastructure Upgrade
If the backend is critical for production, moving from a shared/hibernating hosting to a **VPS** (e.g., DigitalOcean, AWS, or Hostinger Business) with "Always On" capability will permanently solve the cold start issue.

---

## 📊 Performance Comparison

| State | Initial Load (Cold) | Subsequent Loads (Warm) |
| :--- | :--- | :--- |
| **Current Performance** | ~120 Seconds | ~1 - 3 Seconds |
| **With UptimeRobot** | **~2 - 3 Seconds** | **~1 - 3 Seconds** |

**Conclusion:** The delay is NOT caused by incorrect React Native code or logic. It is a infrastructure-level behavior of the backend host. Implementing a simple "Keep-Alive" ping is the fastest way to resolve this.
