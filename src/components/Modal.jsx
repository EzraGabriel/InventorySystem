import { useEffect, useRef, useState } from "react";
import { History, Plus, X } from "lucide-react";

export function Modal({
  dialog,
  item,
  categories = [],
  storageLocations = [],
  onClose,
  onSubmit,
}) {
  const dialogRef = useRef(null);
  const [error, setError] = useState("");
  const [type, setType] = useState(dialog.type || "masuk");
  const [assetType, setAssetType] = useState(item?.assetType || "item");
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  useEffect(() => {
    const initialFocus =
      dialog.kind === "item"
        ? dialogRef.current?.querySelector("#fName")
        : dialogRef.current;
    initialFocus?.focus();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    if (dialog.kind === "item") {
      const details = data.locationDetails.trim();
      data.location = `${data.storageLocation}${details ? ` ${String.fromCharCode(183)} ${details}` : ""}`;
      delete data.storageLocation;
      delete data.locationDetails;
      delete data.image;
      if (imageFile) data.imageFile = imageFile;
    }
    try {
      const message = await onSubmit(data, type);
      if (message) setError(message);
    } catch {
      setError("Data belum dapat disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setImageFile(null);
    setImagePreview("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar seperti JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran foto maksimal 10 MB.");
      event.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const trapFocus = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = [
      ...dialogRef.current.querySelectorAll(
        "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)",
      ),
    ];
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();
      focusable.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
      event.preventDefault();
      focusable[0].focus();
    }
  };

  const isItem = dialog.kind === "item";
  const isEditing = isItem && dialog.mode === "edit";
  const locationParts = isEditing ? item.location.split(` ${String.fromCharCode(183)} `) : [];
  const title = isItem
    ? isEditing ? "Edit barang" : "Tambah barang"
    : type === "masuk"
      ? "Catat barang masuk"
      : "Catat barang keluar";
  const description = isItem
    ? isEditing ? "Perbarui informasi barang inventaris." : "Lengkapi informasi alat untuk menambahkannya ke inventaris."
    : `Stok tersedia ${item.stock} unit · ${item.name}`;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={trapFocus}
      >
        <div className="modal-head">
          <div>
            <h2 className="modal-title" id="modalTitle">
              {title}
            </h2>
            <p className="modal-description" id="modalDescription">
              {description}
            </p>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X />
          </button>
        </div>
        <form noValidate onSubmit={submit}>
          {isItem ? (
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="fName">Nama alat *</label>
                <input
                  id="fName"
                  name="name"
                  autoFocus
                  required
                  defaultValue={isEditing ? item.name : ""}
                  placeholder="Contoh: Kamera Mirrorless A7 III"
                />
              </div>
              {isEditing ? (
                <>
                  <input type="hidden" name="assetType" value={assetType} />
                  <div className="field full"><span className="fieldset-label">Jenis aset</span><span className="field-hint">{assetType === "pc" ? "PC fisik · dicatat per unit" : "Barang inventaris"}</span></div>
                </>
              ) : <div className="field full">
                <label htmlFor="fAssetType">Jenis aset</label>
                <select id="fAssetType" name="assetType" value={assetType} onChange={(event) => setAssetType(event.target.value)}>
                  <option value="item">Barang inventaris</option>
                  <option value="pc">PC fisik · dicatat per unit</option>
                </select>
                <span className="field-hint">Pilih PC fisik untuk mencatat komponen dan riwayat perubahannya.</span>
              </div>}
              {assetType === "pc" && (
                <div className="field full">
                  <label htmlFor="fAssetTag">Kode aset atau nomor seri PC *</label>
                  <input id="fAssetTag" name="assetTag" required maxLength={80} defaultValue={isEditing ? item.assetTag : ""} placeholder="Contoh: PC-001" />
                </div>
              )}
              <div className="field">
                <label htmlFor="fBrand">Merek &amp; tipe *</label>
                <input
                  id="fBrand"
                  name="brand"
                  required
                  defaultValue={isEditing ? item.brand : ""}
                  placeholder="Contoh: Sony · A7 III"
                />
              </div>
              <div className="field">
                <label htmlFor="fCategory">Kategori *</label>
                <select
                  id="fCategory"
                  name="category"
                  required
                  defaultValue={isEditing ? item.category : categories[0] || ""}
                >
                  {isEditing && !categories.includes(item.category) && <option>{item.category}</option>}
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="fYear">Tahun</label>
                <input
                  id="fYear"
                  name="year"
                  type="number"
                  inputMode="numeric"
                  min="1980"
                  max={new Date().getFullYear()}
                  defaultValue={isEditing ? item.year : new Date().getFullYear()}
                />
              </div>
              {isEditing ? (
                <div className="field">
                  <span className="fieldset-label">Jumlah stok</span>
                  <span className="pc-unit-stock">{item.stock} unit</span>
                  <span className="field-hint">Catat perubahan jumlah melalui Barang masuk atau Barang keluar.</span>
                </div>
              ) : assetType === "pc" ? (
                <div className="field">
                  <label>Jumlah stok</label>
                  <span className="pc-unit-stock">1 unit · satu catatan per PC</span>
                  <input type="hidden" name="stock" value="1" />
                </div>
              ) : (
                <div className="field">
                  <label htmlFor="fStock">Jumlah stok *</label>
                  <input
                    id="fStock"
                    name="stock"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    defaultValue="1"
                    required
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="fLocation">Lokasi penyimpanan *</label>
                <select
                  id="fLocation"
                  name="storageLocation"
                  required
                  defaultValue={isEditing ? locationParts[0] : storageLocations[0] || ""}
                >
                  <option value="" disabled>
                    Pilih lokasi
                  </option>
                  {storageLocations.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                  {isEditing && !storageLocations.includes(locationParts[0]) && <option>{locationParts[0]}</option>}
                </select>
              </div>
              <div className="field">
                <label htmlFor="fLocationDetails">Detail lokasi</label>
                <input
                  id="fLocationDetails"
                  name="locationDetails"
                  placeholder="Lemari 2 atau Rak B"
                  defaultValue={isEditing ? locationParts.slice(1).join(` ${String.fromCharCode(183)} `) : ""}
                />
              </div>
              <div className="field full">
                <label htmlFor="fUse">Kegunaan</label>
                <textarea
                  id="fUse"
                  name="use"
                  placeholder="Jelaskan fungsi alat"
                  defaultValue={isEditing ? item.use : ""}
                />
              </div>
              <div className="field full image-upload-field">
                <label htmlFor="fImage">
                  Foto barang <span className="optional-note">(opsional)</span>
                </label>
                <input
                  ref={imageInputRef}
                  id="fImage"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={chooseImage}
                />
                <span className="field-hint">
                  Pilih JPG, PNG, atau WebP. Maksimal 10 MB.
                </span>
                {imagePreview && (
                  <div className="image-upload-preview">
                    <img src={imagePreview} alt="Pratinjau foto barang" />
                    <span>{imageFile?.name}</span>
                    <button
                      type="button"
                      onClick={clearImage}
                      aria-label="Hapus foto pilihan"
                    >
                      <X />
                    </button>
                  </div>
                )}
                {!imagePreview && isEditing && item.image && (
                  <div className="image-upload-preview">
                    <img src={item.image} alt={`Foto barang saat ini: ${item.name}`} />
                    <span>Foto saat ini · pilih file untuk mengganti</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <input type="hidden" name="type" value={type} />
              <fieldset style={{ border: 0, padding: 0, margin: "0 0 16px" }}>
                <legend className="fieldset-label" style={{ marginBottom: 8 }}>
                  Jenis mutasi
                </legend>
                <div className="radio-group">
                  <div className="radio-card">
                    <input
                      type="radio"
                      id="typeIn"
                      name="typeRadio"
                      value="masuk"
                      checked={type === "masuk"}
                      onChange={() => setType("masuk")}
                    />
                    <label htmlFor="typeIn">
                      <Plus /> Barang masuk
                    </label>
                  </div>
                  <div className="radio-card">
                    <input
                      type="radio"
                      id="typeOut"
                      name="typeRadio"
                      value="keluar"
                      checked={type === "keluar"}
                      disabled={item.stock === 0}
                      onChange={() => setType("keluar")}
                    />
                    <label htmlFor="typeOut">
                      <History /> Barang keluar
                    </label>
                  </div>
                </div>
              </fieldset>
              <div className="field" style={{ marginBottom: 15 }}>
                <label htmlFor="fQuantity">Jumlah unit *</label>
                <div className="quantity-control">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                  >
                    −
                  </button>
                  <input
                    id="fQuantity"
                    name="quantity"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={type === "keluar" ? item.stock : 99999}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value))
                    }
                    required
                  />
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(
                          type === "keluar" ? item.stock : 99999,
                          value + 1,
                        ),
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <div className="field-hint">
                  {type === "keluar"
                    ? `Maksimal ${item.stock} unit dapat dikeluarkan.`
                    : "Jumlah akan ditambahkan ke stok saat ini."}
                </div>
              </div>
              <div className="field">
                <label htmlFor="fNote">
                  Keterangan <span className="optional-note">(opsional)</span>
                </label>
                <textarea
                  id="fNote"
                  name="note"
                  placeholder="Contoh: Dipinjam untuk syuting"
                />
              </div>
            </>
          )}
          <div role="alert">
            {error && <p className="form-error">{error}</p>}
          </div>
          <footer className="modal-footer">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan…"
                : isItem
                  ? isEditing ? "Simpan perubahan" : "Simpan barang"
                  : "Simpan mutasi"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
