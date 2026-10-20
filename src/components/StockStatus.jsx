export function StockStatus({ stock }) {
  if (stock === 0) return <span className="stock-pill out">Stok habis</span>;
  if (stock <= 2) return <span className="stock-pill low">Stok menipis</span>;
  return null;
}
