import { ArrowLeft, History, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StockStatus } from '../components/StockStatus.jsx';

export function ItemDetailPage({ item, onMutation }) {
  return (
    <>
      <Link className="back-button" to="/inventory"><ArrowLeft aria-hidden="true" /> Kembali ke inventaris</Link>
      <div className="detail-layout" style={{ marginTop: 14 }}>
        <div><img className="detail-image" src={item.image} alt={`Foto ${item.name}`} /></div>
        <section className="panel">
          <span className="category-pill">{item.category}</span>
          <h1 className="detail-title">{item.name}</h1>
          <div className="detail-brand">{item.brand}</div>
          <p className="detail-description">{item.use}</p>
          <div className="detail-data">
            <div className="detail-cell"><div className="detail-label">Tahun</div><div className="detail-value">{item.year}</div></div>
            <div className="detail-cell"><div className="detail-label">Kategori</div><div className="detail-value">{item.category}</div></div>
            <div className="detail-cell" style={{ gridColumn: '1/-1' }}><div className="detail-label">Lokasi penyimpanan</div><div className="detail-value"><MapPin /> {item.location}</div></div>
          </div>
          <div className="detail-stock"><div><div className="detail-label">Stok tersedia</div>{item.stock <= 2 && <div style={{ marginTop: 6 }}><StockStatus stock={item.stock} /></div>}</div><strong>{item.stock} <span className="detail-stock-unit">unit</span></strong></div>
          <div className="detail-actions"><button className="button button-primary" onClick={() => onMutation('masuk')}><Plus /> Barang masuk</button><button className="button button-soft-danger" disabled={item.stock === 0} onClick={() => onMutation('keluar')}><History /> Barang keluar</button></div>
        </section>
      </div>
    </>
  );
}
