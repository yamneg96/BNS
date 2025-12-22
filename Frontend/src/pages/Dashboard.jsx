import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Assignments from "./Assignments";
import {
  Menu,
  Bed,
  Bell,
  Users,
  LayoutDashboard,
  MessageCircleReply,
  Timer
} from "lucide-react";
import { getUnreadNotificationsCount } from "../services/notification";

const Dashboard = () => {
  const { user, loading, expiry, deptExpiry, wardExpiry } = useAuth();
  const [open, setOpen] = useState(false);
  const [forceRequired, setForceRequired] = useState(false);
  const [updateAssign, setUpdateAssign] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [today, setToday] = useState();
  const navigate = useNavigate();

  /* ---------------- First-time Login ---------------- */
  useEffect(() => {
    if (user && user.firstLoginDone === false) {
      setForceRequired(true);
      setOpen(true);
      setUpdateAssign(false);
    } else {
      setForceRequired(false);
    }
  }, [user]);

  /* ---------------- Admin Redirect ---------------- */
  useEffect(() => {
    if (user?.role === "admin") {
      window.location.href = "/admin";
    }
  }, [user]);

  /* ---------------- Expiry Check ---------------- */
  const hasExpiredAssignment = useMemo(() => {
    if (!expiry) return false;
    const todayStr = new Date().toLocaleDateString("en-CA");
    setToday(todayStr);

    return (
      (deptExpiry && todayStr >= deptExpiry) ||
      (wardExpiry && todayStr >= wardExpiry)
    );
  }, [expiry, deptExpiry, wardExpiry]);

  /* ---------------- Redirect on Expiry ---------------- */
  useEffect(() => {
    if (!loading && user && hasExpiredAssignment && user.role !== "intern") {
      navigate("/update-expiry", { replace: true });
    }
  }, [loading, user, hasExpiredAssignment, navigate]);

  /* ---------------- Notifications ---------------- */
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const { count } = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full">
          <div className="relative mb-6">
            {/* Pulsing Timer Icon */}
            <Timer size={80} className="text-indigo-100 animate-pulse" />
            
            {/* Concentric Medical Spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-slate-50 border-t-indigo-600 animate-spin"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
              System Synchronization
            </h2>
            <p className="text-2xl font-black text-slate-900 italic uppercase">
              Initializing Ward Data...
            </p>
            <p className="text-sm font-medium text-slate-400">
              Fetching departmental bed assignments and patient files.
            </p>
          </div>

          {/* Minimalist Progress Bar placeholder */}
          <div className="w-full bg-slate-50 h-1.5 rounded-full mt-8 overflow-hidden">
            <div className="bg-indigo-600 h-full w-1/3 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Welcome,{" "}
            <span className="text-teal-600">{user.name}</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Medical Role:{" "}
            <span className="font-semibold text-slate-800 capitalize">
              {user.role}
            </span>
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MedicalCard
            to="/beds"
            icon={<Bed size={28} />}
            title="Bed Management"
            desc="Assign and monitor ward beds"
            accent="teal"
          />

          {user.role !== "intern" && (
            <>
              <MedicalCard
                to="/notifications"
                icon={<Bell size={28} />}
                title="Notifications"
                desc="New admissions & alerts"
                accent="amber"
                badge={unreadCount}
              />

              <MedicalCard
                to="/myassignments"
                icon={<LayoutDashboard size={28} />}
                title="My Assignments"
                desc="Your current ward duties"
                accent="blue"
              />

              <MedicalCard
                to="/support-responses"
                icon={<MessageCircleReply size={28} />}
                title="Support Desk"
                desc="Responses from administration"
                accent="slate"
              />
            </>
          )}

          {user.role === "supervisor" && (
            <MedicalCard
              to="/supervisor"
              icon={<Users size={28} />}
              title="Supervisor Panel"
              desc="Staff & system oversight"
              accent="purple"
            />
          )}
        </div>
      </div>

      {/* Floating Action */}
      {/* Manual Override Floating Button */}
      {!forceRequired && (
        <button
          onClick={() => {
            setOpen(true);
            setUpdateAssign(!!user.firstLoginDone);
          }}
          className="cp fixed bottom-10 left-10 z-50 h-16 w-16 bg-indigo-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-110 group active:scale-95"
          aria-label="Assignments"
        >
          <Menu size={28} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      )}

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => !forceRequired && setOpen(false)}
        forceRequired={forceRequired}
        updateAssign={updateAssign}
      >
        <Assignments
          updateAssign={updateAssign}
          closeModal={() => !forceRequired && setOpen(false)}
          onFirstAssignmentComplete={() => {
            setForceRequired(false);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

/* ---------------- Medical Card Component ---------------- */
const MedicalCard = ({ to, icon, title, desc, accent, badge }) => {
  const styles = {
    teal: "bg-teal-50 text-teal-600 border-teal-500",
    blue: "bg-blue-50 text-blue-600 border-blue-500",
    amber: "bg-amber-50 text-amber-600 border-amber-500",
    purple: "bg-purple-50 text-purple-600 border-purple-500",
    slate: "bg-slate-100 text-slate-700 border-slate-500",
  };

  return (
    <Link
      to={to}
      className="relative bg-white rounded-2xl p-6 border-l-4 shadow-md hover:shadow-xl transition-all"
      style={{ borderColor: styles[accent].split(" ")[2] }}
    >
      {badge > 0 && (
        <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
          {badge}
        </span>
      )}

      <div
        className={`inline-flex p-4 rounded-xl ${styles[accent]} mb-5`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </Link>
  );
};

export default Dashboard;
