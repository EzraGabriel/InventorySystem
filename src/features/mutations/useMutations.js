import { useState } from "react";
import { useResolvedImages } from "../../hooks/useResolvedImages.js";

export function useMutations(initialMutations, setItems) {
  const [mutations, setMutations] = useState(initialMutations);
  useResolvedImages(mutations, setMutations);

  function recordMutation(item, data, chosenType) {
    const type = data.type || chosenType;
    const quantity = Number(data.quantity);
    if (!item || !Number.isInteger(quantity) || quantity < 1) {
      return "Masukkan jumlah unit minimal 1.";
    }
    if (type === "keluar" && quantity > item.stock) {
      return `Stok tersedia ${item.stock} unit. Kurangi jumlah barang keluar.`;
    }
    setItems((current) => current.map((candidate) => candidate.id === item.id
      ? { ...candidate, stock: candidate.stock + (type === "masuk" ? quantity : -quantity) }
      : candidate));
    setMutations((current) => [{
      id: Date.now(), itemId: item.id, itemName: item.name,
      image: item.image, imageId: item.imageId || null, type, quantity, note: data.note.trim(),
      date: new Date().toISOString(),
    }, ...current]);
    return null;
  }

  return { mutations, recordMutation };
}
