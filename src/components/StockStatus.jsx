export function StockStatus({ stock, exemptFromLowStock = false }) {
  if (stock === 0) return <span className="stock-pill out">Stok habis</span>;
  if (!exemptFromLowStock && stock <= 2) return <span className="stock-pill low">Stok menipis</span>;
  return null;
}
