import API from "./axios";

export const getStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

export const updateData = async (form) => {
  const res = await API.post("/admin/update", form);
  return res.data;
};

//  Get all non-admin users
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

// Get single user by ID
export const getUserById = async (id) => {
  const res = await API.get(`/admin/users/${id}`);
  return res.data;
};

//  Update user role
export const updateUserRole = async (id, role) => {
  const res = await API.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

// Get all assignments
export const getAllAssignments = async () => {
  const res = await API.get("/admin/assignments");
  return res.data;
};

//  Get all departments
export const getAllDepartments = async () => {
  const res = await API.get("/admin/departments");
  return res.data;
};
