import { createContext, useContext, useState, useEffect } from "react";
import {
  getStats,
  getAllUsers,
  getAllAssignments,
  getAllDepartments,
  updateData,
} from "../services/adminService";
import { toast } from "react-hot-toast";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadUsers();
    loadAssignments();
    loadDepartments();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      toast.error("Failed to load stats");
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await getAllAssignments();
      setAssignments(data);
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  // Add a new ward
  const addWard = async (deptId, wardName) => {
    try {
      const updated = await updateData({
        type: "department",
        payload: {
          deptId,
          updateFields: {
            $push: { wards: { name: wardName, beds: [] } },
          },
        },
      });
      toast.success("Ward added!");
      loadDepartments();
      return updated;
    } catch (err) {
      toast.error("Failed to add ward");
    }
  };

  // Remove a ward
  const removeWard = async (deptId, wardName) => {
    try {
      const updated = await updateData({
        type: "department",
        payload: {
          deptId,
          updateFields: {
            $pull: { wards: { name: wardName } },
          },
        },
      });
      toast.success("Ward removed!");
      loadDepartments();
      return updated;
    } catch (err) {
      toast.error("Failed to remove ward");
    }
  };

  // Add bed to ward
  const addBed = async (deptId, wardName, bedId) => {
    try {
      const updated = await updateData({
        type: "department",
        payload: {
          deptId,
          updateFields: {
            $push: { "wards.$[w].beds": { id: bedId, status: "available" } },
          },
        },
        arrayFilters: [{ "w.name": wardName }],
      });
      toast.success("Bed added!");
      loadDepartments();
      return updated;
    } catch (err) {
      toast.error("Failed to add bed");
    }
  };

  // Remove bed
  const removeBed = async (deptId, wardName, bedId) => {
    try {
      const updated = await updateData({
        type: "department",
        payload: {
          deptId,
          updateFields: {
            $pull: { "wards.$[w].beds": { id: bedId } },
          },
        },
        arrayFilters: [{ "w.name": wardName }],
      });
      toast.success("Bed removed!");
      loadDepartments();
      return updated;
    } catch (err) {
      toast.error("Failed to remove bed");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        assignments,
        departments,
        loading,
        loadDepartments,
        addWard,
        removeWard,
        addBed,
        removeBed,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
