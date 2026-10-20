import { ArrowRight, Camera, Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityList } from '../components/ActivityList.jsx';
import { Button } from '../components/Button.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { UpcomingRequests } from '../components/UpcomingRequests.jsx';

export function DashboardPage({ items, mutations, requests, currentUser, onAddItem }) {
  const total = items.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = items.filter((item) => item.stock <= 2);
  const categories = new Set(items.map((item) => item.category)).size;
  const exhausted = items.filter((item) => item.stock === 0).length;

  return (
    <>
      <PageHeader
        kicker="Ringkasan"
        title="Selamat pagi, Andi"
        description="Pantau inventaris dan aktivitas alat multimedia hari ini."
        action={<Button icon={Plus} variant="primary" onClick={onAddItem}>Tambah barang</Button>}
      />
      <section className="stats" aria-label="Ringkasan inventaris">
        <article className="stat-card"><div className="stat-top">Total unit barang <span className="stat-icon green"><Package /></span></div><div className="stat-value">{total.toLocaleString('id-ID')}</div><div className="stat-note">Tersebar di {items.length} jenis barang</div></article>
        <article className="stat-card"><div className="stat-top">Jenis barang <span className="stat-icon"><Camera /></span></div><div className="stat-value">{items.length}</div><div className="stat-note">Dalam {categories} kategori</div></article>
        <article className="stat-card"><div className="stat-top">Stok menipis <span className="stat-icon amber"><Package /></span></div><div className="stat-value">{lowStock.length}</div><div className="stat-note">Barang dengan stok 2 unit atau kurang</div></article>
        <article className="stat-card"><div className="stat-top">Stok habis <span className="stat-icon" style={{ background: 'var(--red-soft)', color: 'var(--red)' }}><Package /></span></div><div className="stat-value">{exhausted}</div><div className="stat-note">Perlu ditindaklanjuti</div></article>
      </section>
      <UpcomingRequests requests={requests} currentUser={currentUser} />
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-head"><div><h2>Aktivitas terbaru</h2><div className="panel-sub">Catatan barang masuk dan keluar</div></div><Link className="text-link" to="/mutations">Lihat semua <ArrowRight /></Link></div>
          <ActivityList mutations={mutations} limit={5} />
        </article>
        <article className="panel">
          <div className="panel-head"><div><h2>Perlu perhatian</h2><div className="panel-sub">Stok barang menipis atau habis</div></div><span className={`stock-pill ${lowStock.some((item) => !item.stock) ? 'out' : 'low'}`}>{lowStock.length} barang</span></div>
          {lowStock.length ? (
            <div className="low-list">
              {lowStock.slice(0, 4).map((item) => (
                <div className="low-item" key={item.id}><img className="thumb" src={item.image} alt="" /><div className="low-info"><div className="low-name">{item.name}</div><div className="low-meta">{item.location.split(' · ')[0]}</div></div><span className={`stock-pill ${item.stock ? 'low' : 'out'}`}>{item.stock ? `${item.stock} unit` : 'Habis'}</span></div>
              ))}
            </div>
          ) : <div className="empty-state"><strong>Semua stok aman</strong><p>Tidak ada barang yang perlu diperiksa.</p></div>}
        </article>
      </section>
    </>
  );
}

