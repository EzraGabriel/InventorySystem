import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useToast } from "../hooks/useToast.js";
import { AppShell } from "../components/AppShell.jsx";
import { Modal } from "../components/Modal.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { InventoryPage } from "../pages/InventoryPage.jsx";
import { ItemDetailPage } from "../pages/ItemDetailPage.jsx";
import { MutationsPage } from "../pages/MutationsPage.jsx";
import { CalendarPage } from "../pages/CalendarPage.jsx";
import { MasterDataPage } from "../pages/MasterDataPage.jsx";
import { useInventory } from "../features/inventory/useInventory.js";
import { useMutations } from "../features/mutations/useMutations.js";
import { loadInventory, saveInventory } from "../services/inventoryStorage.js";
import { useRequests } from "../features/requests/useRequests.js";
import { useMasterData } from "../features/masterData/useMasterData.js";
import { saveMasterData } from "../services/masterDataStorage.js";
import { saveRequests } from "../services/requestStorage.js";
import "../styles.css";

export default function App() {
  const [initialData] = useState(loadInventory);
  const inventory = useInventory(initialData.items);
  const stockHistory = useMutations(initialData.mutations, inventory.setItems);
  const requestData = useRequests();
  const masterLists = useMasterData(inventory.items, requestData.requests);
  const [role, setRole] = useState("volunteer");
  const currentUser = role === "supervisor"
    ? { id: "supervisor-1", name: "Andi Rahman", role }
    : { id: "volunteer-1", name: "Rina Putri", role };
  const [dialog, setDialog] = useState(null);
  const { message: toast, showToast } = useToast();
  const returnFocusRef = useRef(null);
  const location = useLocation();
  const routerNavigate = useNavigate();
  const detailMatch = location.pathname.match(/^\/inventory\/([^/]+)\/?$/);
  const selectedId = detailMatch ? decodeURIComponent(detailMatch[1]) : null;
  const selectedItem = useMemo(
    () => inventory.items.find((item) => String(item.id) === selectedId),
    [inventory.items, selectedId],
  );

  useEffect(
    () => {
      saveInventory(inventory.items, stockHistory.mutations);
      saveRequests(requestData.requests);
      saveMasterData(masterLists.masterData);
    },
    [inventory.items, stockHistory.mutations, requestData.requests, masterLists.masterData],
  );
  const openDialog = (nextDialog) => {
    returnFocusRef.current = document.activeElement;
    setDialog(nextDialog);
  };
  const closeDialog = () => {
    setDialog(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus?.());
  };
  const submitItem = (data) => {
    const error = inventory.addItem(data);
    if (error) return error;
    closeDialog();
    routerNavigate("/inventory");
    inventory.clearFilters();
    showToast("Barang ditambahkan ke inventaris");
    return null;
  };
  const submitMutation = (data, type) => {
    const error = stockHistory.recordMutation(selectedItem, data, type);
    if (error) return error;
    closeDialog();
    showToast(
      type === "masuk"
        ? "Barang masuk berhasil dicatat"
        : "Barang keluar berhasil dicatat",
    );
    return null;
  };
  const modal = dialog && (
    <Modal
      key={`${dialog.kind}-${dialog.type || ""}`}
      dialog={dialog}
      item={selectedItem}
      categories={masterLists.masterData.categories}
      storageLocations={masterLists.masterData.storageLocations}
      onClose={closeDialog}
      onSubmit={dialog.kind === "item" ? submitItem : submitMutation}
    />
  );

  return (
    <AppShell toast={toast} modal={modal} currentUser={currentUser}>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              items={inventory.items}
              mutations={stockHistory.mutations}
              requests={requestData.requests}
              currentUser={currentUser}
              onAddItem={() => openDialog({ kind: "item" })}
            />
          }
        />
        <Route
          path="/inventory"
          element={
            <InventoryPage
              items={inventory.items}
              query={inventory.query}
              category={inventory.category}
              location={inventory.location}
              categories={masterLists.masterData.categories}
              locations={masterLists.masterData.storageLocations}
              onQueryChange={inventory.setQuery}
              onCategoryChange={inventory.setCategory}
              onLocationChange={inventory.setLocation}
              onAddItem={() => openDialog({ kind: "item" })}
              onOpenItem={(id) => routerNavigate(`/inventory/${id}`)}
              onClearFilters={inventory.clearFilters}
            />
          }
        />
        <Route
          path="/inventory/:itemId"
          element={
            <ItemDetailRoute
              items={inventory.items}
              onMutation={(type) => openDialog({ kind: "mutation", type })}
            />
          }
        />
        <Route
          path="/mutations"
          element={<MutationsPage mutations={stockHistory.mutations} />}
        />
        <Route
          path="/calendar"
          element={
            <CalendarPage
              requests={requestData.requests}
              items={inventory.items}
              activityLocations={masterLists.masterData.activityLocations}
              currentUser={currentUser}
              onRoleChange={setRole}
              onCreate={(data) => requestData.createRequest(data, currentUser)}
              onUpdate={(id, data) => {
                const request = requestData.requests.find((entry) => entry.id === id);
                const canEdit = currentUser.role === "supervisor" || (currentUser.role === "volunteer" && request?.requesterId === currentUser.id);
                if (canEdit) requestData.editRequest(id, data, currentUser, currentUser.role === "volunteer");
              }}
              onReview={(id, status) => {
                if (currentUser.role === "supervisor") {
                  requestData.reviewRequest(id, status, currentUser.name);
                }
              }}
            />
          }
        />
        <Route
          path="/master-data"
          element={currentUser.role === "supervisor" ? (
            <MasterDataPage
              masterData={masterLists.masterData}
              items={inventory.items}
              requests={requestData.requests}
              onAdd={(list, value) => masterLists.addValue(list, value)}
              onRename={(list, oldValue, newValue) => {
                masterLists.renameValue(list, oldValue, newValue);
                if (list === "categories") {
                  inventory.setItems((items) => items.map((item) => item.category === oldValue ? { ...item, category: newValue } : item));
                  if (inventory.category === oldValue) inventory.setCategory(newValue);
                }
                if (list === "storageLocations") {
                  const separator = String.fromCharCode(183);
                  inventory.setItems((items) => items.map((item) => item.location === oldValue || item.location.startsWith(`${oldValue} ${separator}`)
                    ? { ...item, location: `${newValue}${item.location.slice(oldValue.length)}` }
                    : item));
                  if (inventory.location === oldValue) inventory.setLocation(newValue);
                }
                if (list === "activityLocations") {
                  requestData.setRequests((requests) => requests.map((request) => request.location === oldValue ? { ...request, location: newValue } : request));
                }
              }}
              onRemove={(list, value) => {
                masterLists.removeValue(list, value);
                if (list === "categories" && inventory.category === value) inventory.setCategory("Semua kategori");
                if (list === "storageLocations" && inventory.location === value) inventory.setLocation("Semua lokasi");
              }}
            />
          ) : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

function ItemDetailRoute({ items, onMutation }) {
  const { itemId } = useParams();
  const item = items.find((candidate) => String(candidate.id) === itemId);
  if (!item) return <Navigate to="/inventory" replace />;
  return <ItemDetailPage item={item} onMutation={onMutation} />;
}
