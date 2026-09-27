import api from "./axios";

export const createEnquiry = (data) => api.post("/enquiries", data).then((res) => res.data);

export const getEnquiries = () => api.get("/enquiries").then((res) => res.data);

export const replyEnquiry = (id, data) =>
  api.put(`/enquiries/${id}/reply`, data).then((res) => res.data);

export const getContactInfo = () =>
  api.get("/enquiries/contact-info").then((res) => res.data);
