import { ArrowLeft, History, MapPin, Pencil, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StockStatus } from '../components/StockStatus.jsx';
import { PcComponentsPanel } from '../components/PcComponentsPanel.jsx';

export function ItemDetailPage({ item, onMutation, currentUser, onEditItem, onComponentsChange }) {
  return (
    <>
      <Link className="back-button" to="/inventory"><ArrowLeft aria-hidden="true" /> Kembali ke inventaris</Link>
      <div className="detail-layout" style={{ marginTop: 14 }}>
        <div><img className="detail-image" src={item.image} alt={`Foto ${item.name}`} /></div>
        <section className="panel">
          <span className="category-pill">{item.category}</span>
          <div className="detail-title-row">
            <h1 className="detail-title">{item.name}</h1>
            {currentUser?.role === 'supervisor' && <button type="button" className="button button-secondary detail-edit-button" onClick={() => onEditItem(item.id)}><Pencil aria-hidden="true" /> Edit barang</button>}
          </div>
          <div className="detail-brand">{item.brand}</div>
          <p className="detail-description">{item.use}</p>
          <div className="detail-data">
            <div className="detail-cell"><div className="detail-label">Tahun</div><div className="detail-value">{item.year}</div></div>
            <div className="detail-cell"><div className="detail-label">Kategori</div><div className="detail-value">{item.category}</div></div>
            {item.assetType === 'pc' && <div className="detail-cell"><div className="detail-label">Kode aset</div><div className="detail-value">{item.assetTag}</div></div>}
            <div className="detail-cell" style={{ gridColumn: '1/-1' }}><div className="detail-label">Lokasi penyimpanan</div><div className="detail-value"><MapPin /> {item.location}</div></div>
          </div>
          <div className="detail-stock"><div><div className="detail-label">Stok tersedia</div>{(item.stock === 0 || (item.stock <= 2 && item.assetType !== 'pc' && item.category?.trim().toLowerCase() !== 'pc')) && <div style={{ marginTop: 6 }}><StockStatus stock={item.stock} exemptFromLowStock={item.assetType === 'pc' || item.category?.trim().toLowerCase() === 'pc'} /></div>}</div><strong>{item.stock} <span className="detail-stock-unit">unit</span></strong></div>
          <div className="detail-actions"><button className="button button-primary" onClick={() => onMutation('masuk')}><Plus /> Barang masuk</button><button className="button button-soft-danger" disabled={item.stock === 0} onClick={() => onMutation('keluar')}><History /> Barang keluar</button></div>
        </section>
      </div>
      {item.assetType === 'pc' && <PcComponentsPanel item={item} currentUser={currentUser} onChange={onComponentsChange} />}
    </>
  );
}
