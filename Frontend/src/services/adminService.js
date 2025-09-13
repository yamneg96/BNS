import API from "./axios";

export const getStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

export const updateData = async (form) => {
  const res = await API.post("/admin/update", form);
  return res.data;
};
