import { Search } from 'lucide-react';

export function InventoryToolbar({ items, query, category, location, categories = [], locations = [], onQueryChange, onCategoryChange, onLocationChange }) {
  const categoryOptions = ['Semua kategori', ...categories];
  const locationOptions = ['Semua lokasi', ...locations];
  const resultCount = items.filter((item) =>
    `${item.name} ${item.brand}`.toLowerCase().includes(query.toLowerCase()) &&
    (category === 'Semua kategori' || item.category === category) &&
    (location === 'Semua lokasi' || (item.location === location || item.location.startsWith(`${location} ${String.fromCharCode(183)}`))),
  ).length;

  return (
    <div className="inventory-toolbar">
      <label className="search-box">
        <Search aria-hidden="true" />
        <input type="search" name="search" aria-label="Cari nama atau merek barang" placeholder="Cari nama barang atau merek..." value={query} onChange={(event) => onQueryChange(event.target.value)} />
      </label>
      <select className="select" aria-label="Filter kategori" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
        {categoryOptions.map((value) => <option key={value}>{value}</option>)}
      </select>
      <select className="select" aria-label="Filter lokasi" value={location} onChange={(event) => onLocationChange(event.target.value)}>
        {locationOptions.map((value) => <option key={value}>{value}</option>)}
      </select>
      <span className="results-count">{resultCount} barang</span>
    </div>
  );
}
