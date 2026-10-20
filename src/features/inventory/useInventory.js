import { useMemo, useState } from 'react';
import { photo } from '../../utils/images.js';

export function useInventory(initialItems) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua kategori');
  const [location, setLocation] = useState('Semua lokasi');

  const visibleItems = useMemo(() => items.filter((item) =>
    `${item.name} ${item.brand}`.toLowerCase().includes(query.toLowerCase()) &&
    (category === 'Semua kategori' || item.category === category) &&
    (location === 'Semua lokasi' || (item.location === location || item.location.startsWith(`${location} ${String.fromCharCode(183)}`))),
  ), [items, query, category, location]);

  function addItem(data) {
    const name = data.name.trim();
    const brand = data.brand.trim();
    const itemLocation = data.location.trim();
    const stock = Number(data.stock);
    const year = Number(data.year);
    if (!name || !brand || !itemLocation || !Number.isInteger(stock) || stock < 0) {
      return 'Isi nama, merek, lokasi, dan jumlah stok dengan benar.';
    }
    if (year < 1980 || year > new Date().getFullYear()) {
      return 'Masukkan tahun yang valid.';
    }
    setItems((current) => [{
      id: Date.now(), name, brand, category: data.category, year, stock,
      location: itemLocation,
      use: data.use.trim() || 'Belum ada keterangan kegunaan.',
      image: data.image || photo('photo-1516035069371-29a1b244cc32'),
    }, ...current]);
    return null;
  }

  function clearFilters() {
    setQuery('');
    setCategory('Semua kategori');
    setLocation('Semua lokasi');
  }

  return { items, setItems, query, setQuery, category, setCategory, location, setLocation, visibleItems, addItem, clearFilters };
}
