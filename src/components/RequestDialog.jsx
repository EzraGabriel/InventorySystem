import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, Check, Clock3, MapPin, ClipboardList, Pencil, X } from "lucide-react";
import { dateLabel, hasStockConflict, requestStatuses } from "../features/requests/requestUtils.js";

export function RequestDialog({ mode, request, items, requests, activityLocations = [], currentUser, initialDate, onClose, onEdit, onSubmit, onReview }) {
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    itemId: request?.itemId ?? items[0]?.id ?? "", quantity: request?.quantity ?? 1,
    date: request?.date ?? initialDate, startTime: request?.startTime ?? "08:00",
    endTime: request?.endTime ?? "09:00", location: request?.location ?? "", purpose: request?.purpose ?? "",
  }));
  const isForm = mode === "create" || mode === "edit";
  const selectedItem = items.find((item) => String(item.id) === String(form.itemId));
  const conflict = isForm && selectedItem && hasStockConflict({ ...form, id: request?.id, itemId: Number(form.itemId), quantity: Number(form.quantity) }, requests, items);
  const canEdit = currentUser.role === "supervisor" || (currentUser.role === "volunteer" && request?.requesterId === currentUser.id);
  const canReview = currentUser.role === "supervisor" && request?.status === "pending";
  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!selectedItem) return setError("Pilih barang terlebih dahulu.");
    if (form.endTime <= form.startTime) return setError("Jam selesai harus setelah jam mulai.");
    onSubmit({ ...form, itemId: Number(form.itemId), quantity: Number(form.quantity), itemName: selectedItem.name });
  };
  const status = requestStatuses[request?.status];
  return (
    <div className="modal-backdrop calendar-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal request-dialog" role="dialog" aria-modal="true" aria-labelledby="requestDialogTitle">
        <header className="modal-head"><div><h2 className="modal-title" id="requestDialogTitle">{mode === "create" ? "Ajukan permintaan" : mode === "edit" ? "Ubah permintaan" : "Detail permintaan"}</h2><p className="modal-description">{isForm ? "Lengkapi jadwal pemakaian barang lapangan." : "Informasi jadwal dan persetujuan permintaan."}</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Tutup"><X /></button></header>
        {isForm ? <form onSubmit={submit}>
          <div className="form-grid request-form-grid">
            <div className="field full"><label htmlFor="requestItem">Barang *</label><select id="requestItem" name="itemId" value={form.itemId} onChange={update}>{items.map((item) => <option key={item.id} value={item.id}>{item.name} - stok {item.stock}</option>)}</select></div>
            <div className="field"><label htmlFor="requestQuantity">Jumlah *</label><input id="requestQuantity" name="quantity" type="number" min="1" required value={form.quantity} onChange={update} /></div>
            <div className="field"><label htmlFor="requestDate">Tanggal *</label><input id="requestDate" name="date" type="date" required value={form.date} onChange={update} /></div>
            <div className="field"><label htmlFor="requestStart">Jam mulai *</label><input id="requestStart" name="startTime" type="time" required value={form.startTime} onChange={update} /></div>
            <div className="field"><label htmlFor="requestEnd">Jam selesai *</label><input id="requestEnd" name="endTime" type="time" required value={form.endTime} onChange={update} /></div>
            <div className="field full"><label htmlFor="requestLocation">Lokasi kegiatan *</label><select id="requestLocation" name="location" required value={form.location} onChange={update}><option value="" disabled>Pilih lokasi kegiatan</option>{activityLocations.map((location) => <option key={location}>{location}</option>)}</select>{!activityLocations.length && <small className="field-hint">Belum ada lokasi. Minta Supervisor menambahkannya.</small>}</div>
            <div className="field full"><label htmlFor="requestPurpose">Keperluan *</label><textarea id="requestPurpose" name="purpose" required value={form.purpose} onChange={update} placeholder="Jelaskan kegiatan lapangan" /></div>
          </div>
          {conflict && <p className="request-warning" role="status"><AlertTriangle /> Jadwal ini berpotensi melebihi stok tersedia. Permintaan tetap bisa diajukan dan perlu diperiksa petugas.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <footer className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Batal</button><button type="submit" className="button button-primary">{mode === "edit" ? "Kirim perubahan" : "Ajukan permintaan"}</button></footer>
        </form> : <>
          <div className="request-detail-title"><div><strong>{request.itemName}</strong><span>{request.quantity} unit - {request.requesterName}</span></div><span className={`request-status ${status?.color}`}>{status?.label}</span></div>
          <div className="request-detail-list">
            <div><CalendarDays /><span><small>Tanggal</small>{dateLabel(request.date)}</span></div>
            <div><Clock3 /><span><small>Waktu</small>{request.startTime} - {request.endTime}</span></div>
            <div><MapPin /><span><small>Lokasi kegiatan</small>{request.location}</span></div>
            <div><ClipboardList /><span><small>Keperluan</small>{request.purpose}</span></div>
            {request.reviewerName && <div><Check /><span><small>Ditinjau oleh</small>{request.reviewerName}</span></div>}
          </div>
          {hasStockConflict(request, requests, items) && <p className="request-warning"><AlertTriangle /> Ada jadwal bertumpuk yang berpotensi melebihi stok barang.</p>}
          <footer className="modal-footer request-detail-actions"><button type="button" className="button button-secondary" onClick={onClose}>Tutup</button>{canEdit && <button type="button" className="button button-secondary" onClick={() => onEdit(request)}><Pencil /> Ubah permintaan</button>}{canReview && <><button type="button" className="button button-reject" onClick={() => onReview(request, "rejected")}>Tolak</button><button type="button" className="button button-primary" onClick={() => onReview(request, "approved")}><Check /> Setujui</button></>}</footer>
        </>}
      </section>
    </div>
  );
}
