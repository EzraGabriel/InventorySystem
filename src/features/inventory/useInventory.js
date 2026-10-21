import { useMemo, useState } from 'react';
import { photo } from '../../utils/images.js';
import { useResolvedImages } from '../../hooks/useResolvedImages.js';

export function useInventory(initialItems) {
  const [items, setItems] = useState(() => initialItems.map((item) => ({
    ...item,
    image: item.image || photo('photo-1516035069371-29a1b244cc32'),
  })));
  useResolvedImages(items, setItems);
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
    const isPc = data.assetType === 'pc';
    const assetTag = (data.assetTag || '').trim();
    const stock = isPc ? 1 : Number(data.stock);
    const year = Number(data.year);
    if (!name || !brand || !itemLocation || !Number.isInteger(stock) || stock < 0) {
      return 'Isi nama, merek, lokasi, dan jumlah stok dengan benar.';
    }
    if (year < 1980 || year > new Date().getFullYear()) {
      return 'Masukkan tahun yang valid.';
    }
    if (isPc && !assetTag) return 'Isi kode aset atau nomor seri PC.';
    if (isPc && items.some((item) => item.assetType === 'pc' && item.assetTag?.toLocaleLowerCase() === assetTag.toLocaleLowerCase())) {
      return 'Kode aset atau nomor seri PC sudah digunakan.';
    }
    setItems((current) => [{
      id: Date.now(), name, brand, category: data.category, year, stock,
      assetType: isPc ? 'pc' : 'item',
      assetTag: isPc ? assetTag : '',
      components: [],
      componentHistory: [],
      location: itemLocation,
      use: data.use.trim() || 'Belum ada keterangan kegunaan.',
      imageId: data.imageId || null,
      image: data.image || photo('photo-1516035069371-29a1b244cc32'),
    }, ...current]);
    return null;
  }

  function updateItem(id, data) {
    const existing = items.find((item) => String(item.id) === String(id));
    if (!existing) return 'Barang tidak ditemukan. Muat ulang halaman lalu coba lagi.';
    const name = data.name.trim();
    const brand = data.brand.trim();
    const itemLocation = data.location.trim();
    const year = Number(data.year);
    const isPc = existing.assetType === 'pc';
    const assetTag = isPc ? (data.assetTag || '').trim() : existing.assetTag || '';
    if (!name || !brand || !itemLocation) return 'Isi nama, merek, dan lokasi barang.';
    if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear()) {
      return 'Masukkan tahun yang valid.';
    }
    if (isPc && !assetTag) return 'Isi kode aset atau nomor seri PC.';
    if (isPc && items.some((item) => String(item.id) !== String(id) && item.assetType === 'pc' && item.assetTag?.toLocaleLowerCase() === assetTag.toLocaleLowerCase())) {
      return 'Kode aset atau nomor seri PC sudah digunakan.';
    }
    setItems((current) => current.map((item) => String(item.id) === String(id) ? {
      ...item,
      name,
      brand,
      category: data.category,
      year,
      assetTag,
      location: itemLocation,
      use: data.use.trim() || 'Belum ada keterangan kegunaan.',
      ...(data.imageId ? { imageId: data.imageId, image: '' } : {}),
    } : item));
    return null;
  }

  function clearFilters() {
    setQuery('');
    setCategory('Semua kategori');
    setLocation('Semua lokasi');
  }

  return { items, setItems, query, setQuery, category, setCategory, location, setLocation, visibleItems, addItem, updateItem, clearFilters };
}
