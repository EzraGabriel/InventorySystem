import { Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader.jsx';
import { formatDateTime } from '../utils/formatters.js';

export function MutationsPage({ mutations }) {
  const rows = [...mutations].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <>
      <PageHeader kicker="Riwayat" title="Mutasi barang" description="Lacak setiap perubahan jumlah stok inventaris." />
      <section className="panel">
        <div className="panel-head"><div><h2>Semua aktivitas</h2><div className="panel-sub">{mutations.length} catatan tersimpan</div></div><Link className="button button-secondary" to="/inventory"><Box /> Buka inventaris</Link></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Barang</th><th>Jenis</th><th>Jumlah</th><th>Keterangan</th><th>Dicatat</th></tr></thead>
          <tbody>{rows.length ? rows.map((mutation) => <tr key={mutation.id}><td><div className="table-item"><img src={mutation.image || ''} alt="" />{mutation.itemName}</div></td><td><span className={`stock-pill ${mutation.type === 'masuk' ? 'low' : 'out'}`}>{mutation.type === 'masuk' ? 'Masuk' : 'Keluar'}</span></td><td>{mutation.type === 'masuk' ? '+' : '−'}{mutation.quantity} unit</td><td>{mutation.note || '—'}</td><td><time dateTime={mutation.date}>{formatDateTime(mutation.date, { month: 'short', year: 'numeric' })}</time></td></tr>) : <tr><td colSpan="5"><div className="empty-state"><strong>Belum ada catatan mutasi</strong><p>Catat barang masuk atau keluar dari detail barang.</p></div></td></tr>}</tbody>
        </table></div>
      </section>
    </>
  );
}
