import API from "./axios";

export const assignBed = async (bedData) => {
  const res = await API.post("/beds/assign", bedData);
  return res.data;
};

export const getMyBeds = async () => {
  const res = await API.get("/beds/my");
  return res.data;
};
