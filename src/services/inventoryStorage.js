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
  localStorage.setItem('ruangstok_items', JSON.stringify(items));
  localStorage.setItem('ruangstok_mutations', JSON.stringify(mutations));
}
