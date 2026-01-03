import React, { useState } from "react";
import { Menu, X, Hospital, Building2, LayoutGrid, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBed } from "../context/BedContext";
import GoBack from '../components/GoBack';
import SearchBar from '../components/SearchBar';
import WardBedContainer from "../components/WardBedContainer";

const Beds = () => {
  const { user } = useAuth();
  const { departments, loading, admit, discharge } = useBed();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [patientData, setPatientData] = useState({});
  const [transferData, setTransferData] = useState({});

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-medium">Accessing Hospital Registry...</div>;

  const currentDepartment = selectedDepartment || (departments.length > 0 ? departments[0] : null);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative pb-24">
      {/* 1. Header Area */}
      <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <GoBack />
          <div className="hidden md:block">
             <p className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Management System</p>
             <p className="text-right text-sm font-bold text-indigo-600 uppercase italic">Ward Live Feed</p>
          </div>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={`Search Ward...`} />

        {currentDepartment && (
          <div className="mt-8 space-y-8">
            <div className="border-l-4 border-indigo-600 pl-6 py-2">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 flex items-center gap-4 italic uppercase tracking-tighter">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span>{currentDepartment.name}</span>
              </h1>
            </div>

            {/* Vertical Wards Layout */}
            <div className="flex flex-col gap-10">
              {currentDepartment.wards
                .filter(ward => ward.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((ward, idx) => (
                <div key={idx} className="w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <Hospital size={20} className="text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-700 uppercase tracking-tight">{ward.name}</h3>
                    <div className="h-[1px] flex-1 bg-slate-200" />
                  </div>
                  
                  {/* Horizontal Scrollable Beds Container */}
                  <WardBedContainer 
                    ward={ward} 
                    deptId={currentDepartment._id} 
                    departments={departments}
                    patientData={patientData}
                    transferData={transferData}
                    onPatientChange={(bedId, field, val) => setPatientData(prev => ({...prev, [bedId]: {...prev[bedId], [field]: val}}))}
                    onTransferChange={(bedId, field, val) => setTransferData(prev => ({...prev, [bedId]: {...prev[bedId], [field]: val}}))}
                    onAdmit={admit}
                    onDischarge={discharge}
                    user={user}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Floating Action Button (Bottom Left) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 group"
      >
        <LayoutGrid size={20} className="group-hover:rotate-90 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-widest">Departments</span>
      </button>

      {/* 3. Department Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 italic uppercase">Select Unit</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 grid gap-3 max-h-[60vh] overflow-y-auto">
              {departments.map((dept) => (
                <button
                  key={dept._id}
                  onClick={() => { setSelectedDepartment(dept); setIsModalOpen(false); }}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all font-bold ${currentDepartment?._id === dept._id ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-600" : "hover:bg-slate-50 text-slate-600 border border-slate-100"}`}
                >
                  {dept.name}
                  <div className={`h-2 w-2 rounded-full ${currentDepartment?._id === dept._id ? "bg-indigo-600" : "bg-slate-300"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beds;