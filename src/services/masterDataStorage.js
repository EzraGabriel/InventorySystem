const MASTER_DATA_KEY = "ruangstok-master-data-v1";
const locationSeparator = String.fromCharCode(183);
const defaultCategories = ["Kamera", "Lensa", "Audio", "Lighting", "Kabel", "Aksesori"];

export function loadMasterData(items, requests) {
  try {
    const saved = localStorage.getItem(MASTER_DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.categories && parsed.storageLocations && parsed.activityLocations) return parsed;
    }
  } catch { /* Build the initial lists from the frontend demo data. */ }
  return {
    categories: [...new Set([...defaultCategories, ...items.map((item) => item.category)])],
    storageLocations: [...new Set(items.map((item) => item.location.split(locationSeparator)[0].trim()).filter(Boolean))],
    activityLocations: [...new Set(requests.map((request) => request.location).filter(Boolean))],
  };
}

export function saveMasterData(masterData) {
  try { localStorage.setItem(MASTER_DATA_KEY, JSON.stringify(masterData)); }
  catch { /* The frontend demo can continue without persistent browser storage. */ }
}
