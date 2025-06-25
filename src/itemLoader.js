let cachedItems = null;

export async function loadItems(clearCache = false) {
  // Return cache if already loaded
  if (!clearCache && cachedItems) return cachedItems;

  const res = await fetch('./data/items.json');
  if (!res.ok) throw new Error('Failed to load items');

  cachedItems = await res.json(); // Store in cache
  return cachedItems;
}

export async function getItemById(id, clearCache = false) {
  const items = await loadItems(clearCache);
  return items.find(item => item.id === id);
}
