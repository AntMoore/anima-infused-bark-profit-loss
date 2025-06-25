const BASE_URL = 'https://osrs-proxy.vercel.app/api/price';
const CACHE_KEY = 'itemPriceCache';

/**
 * Fetch the latest OSRS price for a given item ID.
 * Uses sessionStorage caching to reduce API calls.
 */
export async function getItemPrice(itemId) {
  const cached = sessionStorage.getItem(CACHE_KEY);
  let cache = cached ? JSON.parse(cached) : { prices: {}, expiresAt: 0 };

  // Use cached price if valid
  if (Date.now() < cache.expiresAt && cache.prices[itemId]) {
    return cache.prices[itemId];
  }

  try {
    const res = await fetch(`${BASE_URL}?id=${itemId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();

    if (data == {} || data == null || data == undefined) return 0;

    const price = Object.values(data.daily).at(-1);

    // Cache until 00:05 UTC next day
    const now = new Date();
    const nextMidnight = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 5
    ));

    cache.prices[itemId] = price;
    cache.expiresAt = nextMidnight.getTime();
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));

    return price;
  } catch (err) {
    console.error(`Error fetching price for item ${itemId}:`, err);
    return null;
  }
}

/**
 * Format a number like 654321 → "654,321 gp"
 */
export function formatGp(value) {
  if (typeof value !== 'number') return 'N/A';
  return `${value.toLocaleString('en-GB')}`;
}
