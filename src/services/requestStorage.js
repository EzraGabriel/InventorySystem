import { createSeedRequests } from "../features/requests/requestUtils.js";
const REQUESTS_KEY = "ruangstok-requests-v1";
export function loadRequests() {
  try {
    const saved = localStorage.getItem(REQUESTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* Use sample data when browser storage is unavailable or invalid. */ }
  return createSeedRequests();
}
export function saveRequests(requests) {
  try { localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests)); }
  catch { /* The frontend demo can continue without persistent browser storage. */ }
}
