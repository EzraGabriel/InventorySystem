import { seedItems } from './seedItems.js';

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadInventory() {
  return {
    items: read('ruangstok_items', seedItems),
    mutations: read('ruangstok_mutations', []),
  };
}

export function saveInventory(items, mutations) {
  const removeLocalImageUrls = (records) => records.map((record) => {
    if (!record.imageId) return record;
    const { image, ...storedRecord } = record;
    return storedRecord;
  });
  localStorage.setItem('ruangstok_items', JSON.stringify(removeLocalImageUrls(items)));
  localStorage.setItem('ruangstok_mutations', JSON.stringify(removeLocalImageUrls(mutations)));
}
