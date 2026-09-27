import api from "./axios";

export const createVisitRequest = (data) => api.post("/visits", data).then((res) => res.data);

export const getVisitRequests = () => api.get("/visits").then((res) => res.data);

export const updateVisitStatus = (id, data) =>
  api.put(`/visits/${id}/status`, data).then((res) => res.data);
