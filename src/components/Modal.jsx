import { useEffect, useRef, useState } from 'react';
import { History, Plus, X } from 'lucide-react';

export function Modal({ dialog, item, categories = [], storageLocations = [], onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState('');
  const [type, setType] = useState(dialog.type || 'masuk');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const initialFocus = dialog.kind === 'item'
      ? dialogRef.current?.querySelector('#fName')
      : dialogRef.current;
    initialFocus?.focus();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (dialog.kind === 'item') {
      const details = data.locationDetails.trim();
      data.location = `${data.storageLocation}${details ? ` ${String.fromCharCode(183)} ${details}` : ''}`;
      delete data.storageLocation;
      delete data.locationDetails;
    }
    const message = onSubmit(data, type);
    if (message) setError(message);
  };

  const trapFocus = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')];
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();
      focusable.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
      event.preventDefault();
      focusable[0].focus();
    }
  };

  const isItem = dialog.kind === 'item';
  const title = isItem ? 'Tambah barang' : type === 'masuk' ? 'Catat barang masuk' : 'Catat barang keluar';
  const description = isItem
    ? 'Lengkapi informasi alat untuk menambahkannya ke inventaris.'
    : `Stok tersedia ${item.stock} unit · ${item.name}`;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDescription" tabIndex={-1} ref={dialogRef} onKeyDown={trapFocus}>
        <div className="modal-head"><div><h2 className="modal-title" id="modalTitle">{title}</h2><p className="modal-description" id="modalDescription">{description}</p></div><button type="button" className="close-button" onClick={onClose} aria-label="Tutup dialog"><X /></button></div>
        <form noValidate onSubmit={submit}>
          {isItem ? (
            <div className="form-grid">
              <div className="field full"><label htmlFor="fName">Nama alat *</label><input id="fName" name="name" autoFocus required placeholder="Contoh: Kamera Mirrorless A7 III" /></div>
              <div className="field"><label htmlFor="fBrand">Merek &amp; tipe *</label><input id="fBrand" name="brand" required placeholder="Contoh: Sony · A7 III" /></div>
              <div className="field"><label htmlFor="fCategory">Kategori *</label><select id="fCategory" name="category" required defaultValue={categories[0] || ''}>{categories.map((value) => <option key={value}>{value}</option>)}</select></div>
              <div className="field"><label htmlFor="fYear">Tahun</label><input id="fYear" name="year" type="number" inputMode="numeric" min="1980" max={new Date().getFullYear()} defaultValue={new Date().getFullYear()} /></div>
              <div className="field"><label htmlFor="fStock">Jumlah stok *</label><input id="fStock" name="stock" type="number" inputMode="numeric" min="0" defaultValue="1" required /></div>
              <div className="field"><label htmlFor="fLocation">Lokasi penyimpanan *</label><select id="fLocation" name="storageLocation" required defaultValue={storageLocations[0] || ''}><option value="" disabled>Pilih lokasi</option>{storageLocations.map((value) => <option key={value}>{value}</option>)}</select></div>
              <div className="field"><label htmlFor="fLocationDetails">Detail lokasi</label><input id="fLocationDetails" name="locationDetails" placeholder="Lemari 2 atau Rak B" /></div>
              <div className="field full"><label htmlFor="fUse">Kegunaan</label><textarea id="fUse" name="use" placeholder="Jelaskan fungsi alat" /></div>
              <div className="field full"><label htmlFor="fImage">URL foto <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opsional)</span></label><input id="fImage" name="image" type="url" placeholder="https://contoh.com/foto.jpg" /></div>
            </div>
          ) : (
            <>
              <input type="hidden" name="type" value={type} />
              <fieldset style={{ border: 0, padding: 0, margin: '0 0 16px' }}>
                <legend className="fieldset-label" style={{ marginBottom: 8 }}>Jenis mutasi</legend>
                <div className="radio-group">
                  <div className="radio-card"><input type="radio" id="typeIn" name="typeRadio" value="masuk" checked={type === 'masuk'} onChange={() => setType('masuk')} /><label htmlFor="typeIn"><Plus /> Barang masuk</label></div>
                  <div className="radio-card"><input type="radio" id="typeOut" name="typeRadio" value="keluar" checked={type === 'keluar'} disabled={item.stock === 0} onChange={() => setType('keluar')} /><label htmlFor="typeOut"><History /> Barang keluar</label></div>
                </div>
              </fieldset>
              <div className="field" style={{ marginBottom: 15 }}><label htmlFor="fQuantity">Jumlah unit *</label><div className="quantity-control"><button type="button" aria-label="Kurangi jumlah" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><input id="fQuantity" name="quantity" type="number" inputMode="numeric" min="1" max={type === 'keluar' ? item.stock : 99999} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required /><button type="button" aria-label="Tambah jumlah" onClick={() => setQuantity((value) => Math.min(type === 'keluar' ? item.stock : 99999, value + 1))}>+</button></div><div className="field-hint">{type === 'keluar' ? `Maksimal ${item.stock} unit dapat dikeluarkan.` : 'Jumlah akan ditambahkan ke stok saat ini.'}</div></div>
              <div className="field"><label htmlFor="fNote">Keterangan <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opsional)</span></label><textarea id="fNote" name="note" placeholder="Contoh: Dipinjam untuk syuting" /></div>
            </>
          )}
          <div role="alert">{error && <p className="form-error">{error}</p>}</div>
          <footer className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Batal</button><button type="submit" className="button button-primary">{isItem ? 'Simpan barang' : 'Simpan mutasi'}</button></footer>
        </form>
      </section>
    </div>
  );
}

