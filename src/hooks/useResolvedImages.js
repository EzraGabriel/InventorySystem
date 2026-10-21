import { useEffect, useRef } from "react";
import { getInventoryImageUrl } from "../services/imageStorage.js";

export function useResolvedImages(records, setRecords) {
  const requested = useRef(new Set());

  useEffect(() => {
    records.forEach((record) => {
      if (!record.imageId || record.image?.startsWith("blob:") || requested.current.has(record.imageId)) return;
      requested.current.add(record.imageId);
      getInventoryImageUrl(record.imageId).then((url) => {
        if (!url) return;
        setRecords((current) => current.map((entry) =>
          entry.imageId === record.imageId ? { ...entry, image: url } : entry,
        ));
      }).catch(() => requested.current.delete(record.imageId));
    });
  }, [records, setRecords]);
}
