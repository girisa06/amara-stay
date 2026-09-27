import api from "./axios";

export const createBooking = (data) => api.post("/bookings", data).then((res) => res.data);

export const getBookings = () => api.get("/bookings").then((res) => res.data);

export const getBooking = (id) => api.get(`/bookings/${id}`).then((res) => res.data);

export const updateBookingStatus = (id, data) =>
  api.put(`/bookings/${id}/status`, data).then((res) => res.data);
