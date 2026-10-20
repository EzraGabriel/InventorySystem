export const requestStatuses = {
  pending: { label: "Menunggu persetujuan", color: "pending" },
  approved: { label: "Disetujui", color: "approved" },
  rejected: { label: "Ditolak", color: "rejected" },
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateLabel(dateKey, options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("id-ID", options).format(new Date(`${dateKey}T12:00:00`));
}

export function timeRangesOverlap(a, b) {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

export function hasStockConflict(request, requests, items) {
  const item = items.find((candidate) => String(candidate.id) === String(request.itemId));
  if (!item) return false;
  const others = requests.filter((candidate) =>
    candidate.id !== request.id && candidate.itemId === request.itemId &&
    candidate.date === request.date && candidate.status !== "rejected" &&
    timeRangesOverlap(candidate, request),
  );
  return [...others, request].reduce((sum, candidate) => sum + Number(candidate.quantity), 0) > item.stock;
}

export function createSeedRequests() {
  const shiftDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return localDateKey(date);
  };
  return [
    { id: "req-1", itemId: 1, itemName: "Kamera Mirrorless A7 III", quantity: 2, date: shiftDate(0), startTime: "08:00", endTime: "12:00", location: "Lapangan Merdeka", purpose: "Dokumentasi kegiatan komunitas", requesterId: "volunteer-1", requesterName: "Rina Putri", status: "pending", createdAt: new Date().toISOString() },
    { id: "req-2", itemId: 3, itemName: "Wireless GO II", quantity: 1, date: shiftDate(0), startTime: "13:00", endTime: "17:00", location: "Balai warga", purpose: "Wawancara relawan", requesterId: "volunteer-2", requesterName: "Dimas Saputra", status: "approved", createdAt: new Date().toISOString() },
    { id: "req-3", itemId: 2, itemName: "Lensa FE 50mm f/1.8", quantity: 1, date: shiftDate(1), startTime: "09:00", endTime: "11:30", location: "Taman kota", purpose: "Foto kegiatan lapangan", requesterId: "volunteer-1", requesterName: "Rina Putri", status: "approved", createdAt: new Date().toISOString() },
    { id: "req-4", itemId: 6, itemName: "Tripod Video Fluid Head", quantity: 1, date: shiftDate(3), startTime: "10:00", endTime: "15:00", location: "Gedung serbaguna", purpose: "Perekaman acara", requesterId: "volunteer-2", requesterName: "Dimas Saputra", status: "rejected", createdAt: new Date().toISOString() },
    { id: "req-5", itemId: 1, itemName: "Kamera Mirrorless A7 III", quantity: 3, date: shiftDate(0), startTime: "10:00", endTime: "14:00", location: "Area pasar", purpose: "Dokumentasi program warga", requesterId: "volunteer-2", requesterName: "Dimas Saputra", status: "pending", createdAt: new Date().toISOString() },
  ];
}
