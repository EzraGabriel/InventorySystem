import { useState } from "react";
import { loadMasterData } from "../../services/masterDataStorage.js";

export function useMasterData(items, requests) {
  const [masterData, setMasterData] = useState(() => loadMasterData(items, requests));

  const addValue = (list, value) => setMasterData((current) => ({
    ...current,
    [list]: [...current[list], value],
  }));
  const renameValue = (list, oldValue, newValue) => setMasterData((current) => ({
    ...current,
    [list]: current[list].map((value) => value === oldValue ? newValue : value),
  }));
  const removeValue = (list, value) => setMasterData((current) => ({
    ...current,
    [list]: current[list].filter((entry) => entry !== value),
  }));

  return { masterData, addValue, renameValue, removeValue };
}
