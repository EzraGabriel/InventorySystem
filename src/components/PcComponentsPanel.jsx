import { useState } from "react";
import { Cpu, HardDrive, MemoryStick, Pencil, Plus, Trash2, X } from "lucide-react";

const componentTypes = ["Prosesor", "Motherboard", "RAM", "Penyimpanan", "Kartu grafis", "Power supply", "Pendingin", "Casing", "Lainnya"];
const componentIcon = (type) => type === "RAM" ? MemoryStick : type === "Penyimpanan" ? HardDrive : Cpu;
const componentLabel = (component) => [component.type, component.model, component.specification].filter(Boolean).join(" · ");
const historyLabel = (entry) => entry.action === "added" ? "Komponen ditambahkan" : entry.action === "replaced" ? "Komponen diganti" : "Komponen dilepas";
const formatDate = (value) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function PcComponentsPanel({ item, currentUser, onChange }) {
  const components = item.components || [];
  const history = item.componentHistory || [];
  const [formMode, setFormMode] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [error, setError] = useState("");
  const canManage = currentUser?.role === "supervisor" || currentUser?.role === "volunteer";

  const openAdd = () => {
    setError("");
    setFormMode({ type: "add", component: { type: componentTypes[0], model: "", specification: "", serialNumber: "", note: "" } });
  };
  const openReplace = (component) => {
    setError("");
    setFormMode({ type: "replace", component: { ...component, note: "" } });
  };
  const closeForm = () => {
    setFormMode(null);
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!values.model.trim()) {
      setError("Isi nama atau model komponen.");
      return;
    }
    const nextComponent = {
      id: globalThis.crypto?.randomUUID?.() || `component-${Date.now()}`,
      type: values.type,
      model: values.model.trim(),
      specification: values.specification.trim(),
      serialNumber: values.serialNumber.trim(),
      installedAt: new Date().toISOString(),
    };
    const oldComponent = formMode.type === "replace" ? formMode.component : null;
    const nextComponents = formMode.type === "replace"
      ? components.map((component) => component.id === oldComponent.id ? nextComponent : component)
      : [...components, nextComponent];
    const entry = {
      id: globalThis.crypto?.randomUUID?.() || `component-history-${Date.now()}`,
      action: oldComponent ? "replaced" : "added",
      oldComponent,
      newComponent: nextComponent,
      note: values.note.trim(),
      changedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    onChange(nextComponents, [entry, ...history]);
    closeForm();
  };

  const removeComponent = (component) => {
    const entry = {
      id: globalThis.crypto?.randomUUID?.() || `component-history-${Date.now()}`,
      action: "removed",
      oldComponent: component,
      newComponent: null,
      note: "",
      changedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    onChange(components.filter((candidate) => candidate.id !== component.id), [entry, ...history]);
    setRemoveId(null);
  };

  return (
    <section className="panel pc-components-panel" aria-labelledby="pc-components-title">
      <header className="pc-components-head">
        <div>
          <h2 id="pc-components-title">Komponen PC</h2>
          <p className="panel-sub">Konfigurasi untuk unit {item.assetTag}.</p>
        </div>
        {canManage && <button className="button button-secondary" type="button" onClick={openAdd}><Plus aria-hidden="true" /> Tambah komponen</button>}
      </header>

      {!components.length ? (
        <div className="pc-components-empty">
          <strong>Belum ada komponen tercatat.</strong>
          <p>{canManage ? "Tambahkan komponen yang terpasang pada PC ini." : "Pengguna dengan akses edit dapat menambahkan rincian komponen."}</p>
        </div>
      ) : (
        <div className="pc-component-list">
          {components.map((component) => {
            const Icon = componentIcon(component.type);
            return (
              <article className="pc-component-row" key={component.id}>
                <span className="pc-component-icon" aria-hidden="true"><Icon /></span>
                <div className="pc-component-info">
                  <strong>{component.type}</strong>
                  <span>{component.model}{component.specification ? ` · ${component.specification}` : ""}</span>
                  {component.serialNumber && <small>Serial: {component.serialNumber}</small>}
                </div>
                {canManage && <div className="pc-component-actions">
                  <button type="button" onClick={() => openReplace(component)} aria-label={`Ganti ${component.type}`}><Pencil aria-hidden="true" /><span>Ganti</span></button>
                  <button type="button" onClick={() => { setFormMode(null); setRemoveId(component.id); }} aria-label={`Lepas ${component.type}`}><Trash2 aria-hidden="true" /><span>Lepas</span></button>
                </div>}
                {removeId === component.id && <div className="pc-remove-confirm" role="group" aria-label="Konfirmasi melepas komponen">
                  <span>Lepas {component.type} dari PC ini?</span>
                  <button type="button" className="button button-soft-danger" onClick={() => removeComponent(component)}>Lepas komponen</button>
                  <button type="button" className="button button-secondary" onClick={() => setRemoveId(null)}>Batal</button>
                </div>}
              </article>
            );
          })}
        </div>
      )}

      {formMode && <form className="pc-component-form" onSubmit={submit}>
        <div className="pc-component-form-head">
          <h3>{formMode.type === "replace" ? `Ganti ${formMode.component.type}` : "Komponen baru"}</h3>
          <button type="button" onClick={closeForm} aria-label="Tutup formulir"><X aria-hidden="true" /></button>
        </div>
        <div className="pc-component-form-grid">
          <div className="field">
            <label htmlFor="pcComponentType">Jenis komponen</label>
            <select id="pcComponentType" name="type" defaultValue={formMode.component.type}>
              {componentTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pcComponentModel">Nama / model *</label>
            <input id="pcComponentModel" name="model" required maxLength={100} defaultValue={formMode.type === "replace" ? "" : formMode.component.model} placeholder="Contoh: AMD Ryzen 5 5600" />
          </div>
          <div className="field">
            <label htmlFor="pcComponentSpecification">Spesifikasi</label>
            <input id="pcComponentSpecification" name="specification" maxLength={120} defaultValue={formMode.type === "replace" ? "" : formMode.component.specification} placeholder="Contoh: 16 GB DDR4" />
          </div>
          <div className="field">
            <label htmlFor="pcComponentSerial">Nomor seri <span className="optional-note">(opsional)</span></label>
            <input id="pcComponentSerial" name="serialNumber" maxLength={100} defaultValue={formMode.type === "replace" ? "" : formMode.component.serialNumber} />
          </div>
          <div className="field full">
            <label htmlFor="pcComponentNote">Catatan perubahan <span className="optional-note">(opsional)</span></label>
            <input id="pcComponentNote" name="note" maxLength={200} placeholder="Contoh: Upgrade RAM untuk kebutuhan editing" />
          </div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="pc-component-form-actions">
          <button className="button button-secondary" type="button" onClick={closeForm}>Batal</button>
          <button className="button button-primary" type="submit">Simpan komponen</button>
        </div>
      </form>}

      {!!history.length && <details className="pc-component-history">
        <summary>Riwayat perubahan <span>{history.length}</span></summary>
        <ol>
          {history.map((entry) => <li key={entry.id}>
            <div><strong>{historyLabel(entry)}</strong><time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time></div>
            {entry.oldComponent && <p>Sebelumnya: {componentLabel(entry.oldComponent)}</p>}
            {entry.newComponent && <p>Sekarang: {componentLabel(entry.newComponent)}</p>}
            {entry.note && <p>{entry.note}</p>}
            <small>Oleh {entry.changedBy}</small>
          </li>)}
        </ol>
      </details>}
    </section>
  );
}
