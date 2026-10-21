const databaseName = "ruangstok-media";
const storeName = "inventory-images";
let databasePromise;
const objectUrls = new Map();

function openDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(storeName)) {
          request.result.createObjectStore(storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return databasePromise;
}

function optimizeImage(file) {
  if (typeof createImageBitmap !== "function") return Promise.resolve(file);
  return createImageBitmap(file).then((bitmap) => {
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Foto tidak dapat diproses."));
        resolve(blob.size < file.size ? blob : file);
      }, "image/webp", 0.82);
    });
  });
}

export async function storeInventoryImage(file) {
  const imageId = globalThis.crypto?.randomUUID?.() || `inventory-image-${Date.now()}`;
  const image = await optimizeImage(file);
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(image, imageId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("Penyimpanan foto dibatalkan."));
  });
  return imageId;
}

export async function getInventoryImageUrl(imageId) {
  if (objectUrls.has(imageId)) return objectUrls.get(imageId);
  const database = await openDatabase();
  const image = await new Promise((resolve, reject) => {
    const request = database.transaction(storeName, "readonly").objectStore(storeName).get(imageId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  if (!image) return null;
  const url = URL.createObjectURL(image);
  objectUrls.set(imageId, url);
  return url;
}

export async function deleteInventoryImage(imageId) {
  if (!imageId) return;
  const objectUrl = objectUrls.get(imageId);
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrls.delete(imageId);
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(imageId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}
