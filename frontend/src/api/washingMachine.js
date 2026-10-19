import api from "./axios";

const MACHINE_KEY = "shared-washing-machine";

export const getWashingMachineStatus = () =>
  api.get(`/washing-machines/${MACHINE_KEY}/status`).then((response) => response.data);

export const getWashingMachineHistory = () =>
  api.get(`/washing-machines/${MACHINE_KEY}/history`).then((response) => response.data);

export const startWashingMachineSession = () =>
  api.post(`/washing-machines/${MACHINE_KEY}/sessions`).then((response) => response.data);

export const endWashingMachineSession = (sessionId) =>
  api.post(`/washing-machines/${MACHINE_KEY}/sessions/${sessionId}/end`).then((response) => response.data);

export const reportWashingMachineSession = (sessionId) =>
  api.post(`/washing-machines/${MACHINE_KEY}/sessions/${sessionId}/report`).then((response) => response.data);

export const releaseReportedWashingMachineSession = (sessionId) =>
  api.post(`/washing-machines/${MACHINE_KEY}/sessions/${sessionId}/release`).then((response) => response.data);
