import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchDepartments,
  admitPatient,
  dischargePatient,
} from "../services/bed";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const BedContext = createContext();

export const BedProvider = ({ children }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
      console.log(data);
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

// Admit
  const admit = async (deptId, wardName, bedId) => {
    try {
      const res = await admitPatient({ deptId, wardName, bedId });

      // if backend returns a notification message
      if (res.notifyUser) {
        toast.success(res.message); 
      } else {
        toast.success(res.message || "Admit handled");
      }

      loadDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Admit failed");
    }
  };

  // Discharge
  const discharge = async (deptId, wardName, bedId) => {
    try {
      const res = await dischargePatient({ deptId, wardName, bedId });

      if (res.notifyUser) {
        toast.success(res.message);
      } else {
        toast.success(res.message || "Discharge handled");
      }

      loadDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Discharge failed");
    }
  };


  return (
    <BedContext.Provider
      value={{
        departments,
        loading,
        admit,
        discharge,
      }}
    >
      {children}
    </BedContext.Provider>
  );
};

export const useBed = () => useContext(BedContext);
