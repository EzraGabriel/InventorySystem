import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { InventoryToolbar } from '../components/InventoryToolbar.jsx';
import { ItemCard } from '../components/ItemCard.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

export function InventoryPage({ items, query, category, location, onQueryChange, onCategoryChange, onLocationChange, categories, locations, onAddItem, onOpenItem, onClearFilters }) {
  const visibleItems = useMemo(() => items.filter((item) =>
    `${item.name} ${item.brand}`.toLowerCase().includes(query.toLowerCase()) &&
    (category === 'Semua kategori' || item.category === category) &&
    (location === 'Semua lokasi' || (item.location === location || item.location.startsWith(`${location} ${String.fromCharCode(183)}`))),
  ), [items, query, category, location]);

  return (
    <>
      <PageHeader kicker="Katalog" title="Inventaris" description="Cari alat, periksa jumlah stok, dan temukan lokasi penyimpanannya." action={<Button icon={Plus} variant="primary" onClick={onAddItem}>Tambah barang</Button>} />
      <section aria-label="Daftar inventaris">
        <InventoryToolbar items={items} query={query} category={category} location={location} onQueryChange={onQueryChange} onCategoryChange={onCategoryChange} onLocationChange={onLocationChange} categories={categories} locations={locations} />
        <div className="inventory-grid">
          {visibleItems.length ? visibleItems.map((item) => <ItemCard key={item.id} item={item} onOpen={() => onOpenItem(item.id)} />) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}><strong>Tidak ada barang yang cocok</strong><p>Ubah kata kunci atau filter untuk melihat barang lain.</p><button className="button button-secondary" onClick={onClearFilters}>Hapus filter</button></div>
          )}
        </div>
      </section>
    </>
  );
}

