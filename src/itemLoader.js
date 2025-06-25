import { getItemPrice, formatGp } from './priceFetcher.js';

let cachedItems = null;

export async function loadItems(clearCache = false) {
  if (!clearCache && cachedItems) return cachedItems;

  const res = await fetch('./src/data/items.json');
  if (!res.ok) throw new Error('Failed to load items');

  const rawItems = await res.json();

  // Enrich items with live prices
  const enrichedItems = await Promise.all(
    rawItems.map(async item => {
      const price = await getItemPrice(item.id);
      const formattedPrice = formatGp(price);
      return {
        ...item,
        price: formattedPrice ?? null // fallback if API fails
      };
    })
  );

  cachedItems = enrichedItems;
  return cachedItems;
}

export async function getItemById(id, clearCache = false) {
  const items = await loadItems(clearCache);
  return items.find(item => item.id === id);
}
