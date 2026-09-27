import api from "./axios";

export const getRooms = (params) => api.get("/rooms", { params }).then((res) => res.data);

export const getRoom = (id) => api.get(`/rooms/${id}`).then((res) => res.data);

export const createRoom = (data) => api.post("/rooms", data).then((res) => res.data);

export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data).then((res) => res.data);

export const deleteRoom = (id) => api.delete(`/rooms/${id}`).then((res) => res.data);
