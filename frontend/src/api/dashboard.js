import api from "./axios";

export const getOverview = () => api.get("/dashboard/overview").then((res) => res.data);

export const getOccupancyTrend = () =>
  api.get("/dashboard/occupancy-trend").then((res) => res.data);

export const getRevenueTrend = () => api.get("/dashboard/revenue-trend").then((res) => res.data);

export const getBookingGrowth = () =>
  api.get("/dashboard/booking-growth").then((res) => res.data);

export const getTenants = () => api.get("/tenants").then((res) => res.data);
