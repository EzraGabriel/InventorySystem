import { ArrowRight, MapPin } from 'lucide-react';
import { StockStatus } from './StockStatus.jsx';

export function ItemCard({ item, onOpen }) {
  return (
    <article className="item-card">
      <img className="item-photo" src={item.image} alt={`Foto ${item.name}`} loading="lazy" />
      <div className="item-card-body">
        <div className="item-card-top">
          <div>
            <div className="item-name">{item.name}</div>
            <div className="item-brand">{item.brand}</div>
          </div>
          <StockStatus stock={item.stock} exemptFromLowStock={item.assetType === 'pc' || item.category?.trim().toLowerCase() === 'pc'} />
        </div>
        <div className="item-meta">
          <div className="item-location"><MapPin aria-hidden="true" /><span>{item.location}</span></div>
          <div className="item-stock"><strong>{item.stock}</strong> unit</div>
        </div>
        <button type="button" className="button button-secondary card-open" onClick={onOpen}>
          Lihat detail <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
