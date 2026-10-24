import api from "./axios";

export const getMyPayments = () => api.get("/payments/my").then((r) => r.data);
export const getPaymentSummary = () => api.get("/payments/summary").then((r) => r.data);
export const getPaymentSettings = () => api.get("/payments/settings").then((r) => r.data);
// Leave multipart headers to Axios/the browser so the generated boundary matches the body.
export const submitPayment = (data) => api.post("/payments/submit", data).then((r) => r.data);
export const getAdminPayments = (params = {}) => api.get("/admin/payments", { params }).then((r) => r.data);
export const verifyPayment = (id) => api.post(`/admin/payments/${id}/verify`).then((r) => r.data);
export const rejectPayment = (id, reason) => api.post(`/admin/payments/${id}/reject`, { reason }).then((r) => r.data);
export const savePaymentSettings = (upi_id) => api.put("/admin/payments/settings", { upi_id }).then((r) => r.data);
export const fetchPaymentProof = async (id) => URL.createObjectURL((await api.get(`/payments/${id}/proof`, { responseType: "blob" })).data);
