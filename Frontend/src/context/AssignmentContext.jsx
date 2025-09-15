import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getActiveAssignmentsForUser } from "../services/assignment";

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActive = async () => {
    if (!user) return;
    try {
      const data = await getActiveAssignmentsForUser(user._id);
      setActiveAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, [user]);

  return (
    <AssignmentContext.Provider value={{ activeAssignments, fetchActive, loading }}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => useContext(AssignmentContext);
