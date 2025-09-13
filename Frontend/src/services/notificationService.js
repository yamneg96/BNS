import API from "./axios";

export const admitPatient = async (bedId) => {
  const res = await API.post(`/notifications/admit/${bedId}`);
  return res.data;
};

export const withdrawPatient = async (bedId) => {
  const res = await API.post(`/notifications/withdraw/${bedId}`);
  return res.data;
};

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};
