import { formatDateTime } from '../utils/formatters.js';

export function ActivityList({ mutations, limit = 8 }) {
  const rows = [...mutations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
  if (!rows.length) {
    return <div className="empty-state"><strong>Belum ada aktivitas</strong><p>Mutasi stok akan muncul di sini setelah dicatat.</p></div>;
  }
  return (
    <div className="activity-list">
      {rows.map((mutation) => (
        <div className="activity" key={mutation.id}>
          <div className={`activity-icon ${mutation.type === 'masuk' ? 'in' : 'out'}`} aria-hidden="true">
            {mutation.type === 'masuk' ? '+' : '−'}
          </div>
          <div className="activity-main">
            <div className="activity-title">{mutation.type === 'masuk' ? 'Barang masuk' : 'Barang keluar'} · {mutation.itemName}</div>
            <div className="activity-detail">
              {mutation.type === 'masuk' ? 'Ditambahkan' : 'Dikeluarkan'} {mutation.quantity} unit{mutation.note ? ` · ${mutation.note}` : ''}
            </div>
          </div>
          <time className="activity-time" dateTime={mutation.date}>{formatDateTime(mutation.date, { month: 'short' })}</time>
        </div>
      ))}
    </div>
  );
}
