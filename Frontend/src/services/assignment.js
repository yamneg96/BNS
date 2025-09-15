import API from "./axios";

// Create new assignment
export const createAssignment = async (assignmentData) => {
  const res = await API.post("/assignments", assignmentData);
  return res.data;
};

// Get all assignments for a user
export const getAssignmentsForUser = async (userId) => {
  const res = await API.get(`/assignments/user/${userId}`);
  return res.data;
};

// Get active assignments for a user
export const getActiveAssignmentsForUser = async (userId) => {
  const res = await API.get(`/assignments/user/${userId}/active`);
  return res.data;
};

// Delete assignment
export const deleteAssignment = async (id) => {
  const res = await API.delete(`/assignments/${id}`);
  return res.data;
};
