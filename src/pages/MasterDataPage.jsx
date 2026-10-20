import { useState } from "react";
import { Archive, Check, MapPin, Package, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";

const sections = [
  { key: "categories", title: "Kategori barang", description: "Kelompokkan barang inventaris.", icon: Tag, noun: "kategori" },
  { key: "storageLocations", title: "Lokasi penyimpanan", description: "Lokasi induk tempat barang disimpan.", icon: Package, noun: "lokasi penyimpanan" },
  { key: "activityLocations", title: "Lokasi kegiatan", description: "Pilihan lokasi untuk permintaan lapangan.", icon: MapPin, noun: "lokasi kegiatan" },
];

function usageCount(key, value, items, requests) {
  if (key === "categories") return items.filter((item) => item.category === value).length;
  if (key === "storageLocations") {
    const separator = String.fromCharCode(183);
    return items.filter((item) => item.location === value || item.location.startsWith(`${value} ${separator}`)).length;
  }
  return requests.filter((request) => request.location === value).length;
}

function MasterDataSection({ section, values, items, requests, onAdd, onRename, onRemove }) {
  const [newValue, setNewValue] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const Icon = section.icon;
  const isDuplicate = (value, current) => values.some((entry) => entry.toLocaleLowerCase() === value.toLocaleLowerCase() && entry !== current);
  const add = (event) => {
    event.preventDefault();
    const value = newValue.trim();
    if (!value) return;
    if (isDuplicate(value)) return setError(`Nama ${section.noun} sudah ada.`);
    onAdd(section.key, value);
    setNewValue("");
    setError("");
  };
  const saveEdit = (event) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return setError("Nama tidak boleh kosong.");
    if (isDuplicate(value, editing)) return setError(`Nama ${section.noun} sudah ada.`);
    onRename(section.key, editing, value);
    setEditing(null);
    setDraft("");
    setError("");
  };

  return (
    <section className="panel master-list-panel">
      <header className="master-list-head"><span className="master-list-icon"><Icon /></span><div><h2>{section.title}</h2><p className="panel-sub">{section.description}</p></div><span className="master-list-total">{values.length}</span></header>
      <form className="master-add-form" onSubmit={add}><label className="sr-only" htmlFor={`add-${section.key}`}>Tambah {section.noun}</label><input id={`add-${section.key}`} value={newValue} onChange={(event) => { setNewValue(event.target.value); setError(""); }} placeholder={`Nama ${section.noun}`} maxLength={60} /><button className="button button-primary" type="submit" disabled={!newValue.trim()}><Plus /> Tambah</button></form>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="master-values-list">
        {values.map((value) => {
          const count = usageCount(section.key, value, items, requests);
          const isEditing = editing === value;
          return <div className="master-value-row" key={value}>
            {isEditing ? <form className="master-edit-form" onSubmit={saveEdit}><label className="sr-only" htmlFor={`edit-${section.key}`}>Ubah nama {section.noun}</label><input id={`edit-${section.key}`} autoFocus value={draft} onChange={(event) => { setDraft(event.target.value); setError(""); }} maxLength={60} /><button className="master-icon-action" type="submit" aria-label="Simpan perubahan"><Check /></button><button className="master-icon-action" type="button" onClick={() => { setEditing(null); setError(""); }} aria-label="Batal mengubah"><X /></button></form> : <><span className="master-value-name">{value}</span><span className="master-usage">{count} {section.key === "activityLocations" ? "permintaan" : "barang"}</span><button className="master-icon-action" type="button" onClick={() => { setEditing(value); setDraft(value); setError(""); }} aria-label={`Ubah ${value}`}><Pencil /></button><button className="master-icon-action danger" type="button" disabled={count > 0} title={count > 0 ? "Masih dipakai; ubah nama atau pindahkan data yang menggunakannya terlebih dahulu." : `Hapus ${value}`} onClick={() => onRemove(section.key, value)} aria-label={`Hapus ${value}`}><Trash2 /></button></>}
          </div>;
        })}
        {!values.length && <div className="master-empty"><Archive /><span>Belum ada pilihan. Tambahkan untuk mulai menggunakannya.</span></div>}
      </div>
      {error && editing && <p className="form-error" role="alert">{error}</p>}
      <p className="master-list-note">Nama yang sedang dipakai barang atau permintaan tidak dapat dihapus. Ubah namanya untuk memperbarui data terkait.</p>
    </section>
  );
}

export function MasterDataPage({ masterData, items, requests, onAdd, onRename, onRemove }) {
  return <>
    <PageHeader kicker="Pengaturan inventaris" title="Kategori & lokasi" description="Atur pilihan kategori dan lokasi yang digunakan di formulir barang serta permintaan." />
    <div className="master-data-grid">{sections.map((section) => <MasterDataSection key={section.key} section={section} values={masterData[section.key]} items={items} requests={requests} onAdd={onAdd} onRename={onRename} onRemove={onRemove} />)}</div>
  </>;
}
