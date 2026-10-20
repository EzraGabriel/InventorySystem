import { useState } from "react";
import { loadRequests } from "../../services/requestStorage.js";
export function useRequests() {
  const [requests, setRequests] = useState(loadRequests);
  const createRequest = (data, user) => setRequests((current) => [{
    ...data, id: crypto.randomUUID(), itemId: Number(data.itemId), quantity: Number(data.quantity),
    requesterId: user.id, requesterName: user.name, status: "pending", createdAt: new Date().toISOString(),
  }, ...current]);
  const editRequest = (id, data, editor, requiresApproval) => setRequests((current) => current.map((request) => {
    if (request.id !== id) return request;
    const status = requiresApproval || request.status === "rejected" ? "pending" : request.status;
    return {
      ...request, ...data, itemId: Number(data.itemId), quantity: Number(data.quantity),
      status, lastEditedBy: editor.name,
      reviewerName: status === "pending" ? null : request.reviewerName,
      reviewedAt: status === "pending" ? null : request.reviewedAt,
    };
  }));
  const reviewRequest = (id, status, supervisorName) => setRequests((current) => current.map((request) => request.id === id ? {
    ...request, status, reviewerName: supervisorName, reviewedAt: new Date().toISOString(),
  } : request));
  return { requests, setRequests, createRequest, editRequest, reviewRequest };
}
