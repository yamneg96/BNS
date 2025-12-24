import React, { useState, useEffect, useRef, memo } from "react";
import { Menu, X, Hospital, Bed, User, Building2, Timer, ArrowRightLeft, UserPlus, Save, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBed } from "../context/BedContext";
import toast from "react-hot-toast";
import GoBack from '../components/GoBack';
import SearchBar from '../components/SearchBar';

// --- WARD BED CONTAINER (MOVED OUTSIDE) ---
const WardBedContainer = memo(({ ward, deptId, departments, patientData, transferData, onPatientChange, onTransferChange, onAdmit, onDischarge, user }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic enabled for ALL screen widths
  useEffect(() => {
    if (isPaused) return; 

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we reached the end, snap back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by the width of one bed card
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 4000); 
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        /* Removed lg:flex-wrap to keep it horizontal on PC */
        className="flex flex-nowrap overflow-x-scroll gap-6 pb-6 snap-x scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ward.beds.map((bed) => {
          const currentName = patientData[bed.id]?.name ?? bed.patient?.name ?? "";
          const currentAge = patientData[bed.id]?.age ?? bed.patient?.age ?? "";
          const currentSex = patientData[bed.id]?.sex ?? bed.patient?.sex ?? "";
          const currentComplaint = patientData[bed.id]?.chiefComplaint ?? bed.patient?.chiefComplaint ?? "";

          const tData = transferData[bed.id] || {};
          const tDept = departments.find(d => d._id === tData.deptId);
          const tWard = tDept?.wards.find(w => w.name === tData.wardName);
          const tAvailableBeds = tWard?.beds.filter(b => b.status === "available") || [];

          return (
            <div
              key={bed.id}
              /* Fixed widths to ensure they don't shrink and stay consistent in the slider */
              className={`flex-shrink-0 w-[320px] md:w-[420px] snap-center p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                bed.status === "occupied" ? "bg-red-50/50 border-red-100" : "bg-green-50/50 border-green-100"
              }`}
            >
              {bed.status === "occupied" && (
                <div className="mb-4 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ArrowRightLeft size={14} /> Transfer Patient To:
                  </p>
                  <div className="space-y-2">
                    <select 
                      value={tData.deptId || ""}
                      onChange={(e) => onTransferChange(bed.id, 'deptId', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>

                    {tData.deptId && (
                      <select 
                        value={tData.wardName || ""}
                        onChange={(e) => onTransferChange(bed.id, 'wardName', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50"
                      >
                        <option value="">Select Ward</option>
                        {tDept.wards.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                      </select>
                    )}

                    {tData.wardName && (
                      <select 
                        value={tData.targetBedId || ""}
                        onChange={(e) => onTransferChange(bed.id, 'targetBedId', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50"
                      >
                        <option value="">Select Bed</option>
                        {tAvailableBeds.map(b => <option key={b.id} value={b.id}>Bed {b.id}</option>)}
                      </select>
                    )}

                    <button 
                      disabled={!tData.targetBedId}
                      className={`w-full text-white text-[10px] font-black py-2.5 rounded-xl transition-all uppercase tracking-widest ${
                        !tData.targetBedId ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      onClick={() => toast.success("Transfer Initialized")}
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${bed.status === 'occupied' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    <Bed size={20} />
                  </div>
                  <div>
                    <p className="font-black text-lg text-slate-800">BED {bed.id}</p>
                    <p className="text-[10px] font-bold text-slate-400">Assigned: {bed.assignedUser?.name ? "YES" : "NO"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <UserPlus size={14} /> Patient Info
                </p>
                <input 
                  placeholder="Name"
                  value={currentName}
                  className="w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none"
                  onChange={(e) => onPatientChange(bed.id, 'name', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" placeholder="Age" value={currentAge}
                    className="p-3 text-sm rounded-xl border border-slate-100 bg-slate-50"
                    onChange={(e) => onPatientChange(bed.id, 'age', e.target.value)}
                  />
                  <select 
                    value={currentSex}
                    className="p-3 text-sm rounded-xl border border-slate-100 bg-slate-50"
                    onChange={(e) => onPatientChange(bed.id, 'sex', e.target.value)}
                  >
                    <option value="">Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <textarea 
                  placeholder="Complaint" value={currentComplaint}
                  className="w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 h-20 resize-none"
                  onChange={(e) => onPatientChange(bed.id, 'chiefComplaint', e.target.value)}
                />
                
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                  onClick={() => toast.success("Data Saved Locally")}
                >
                  <Save size={14} /> Save Patient Info
                </button>

                <div className="h-[1px] bg-slate-100 my-2" />

                {bed.status === "available" ? (
                  <button 
                    onClick={() => onAdmit(deptId, ward.name, bed.id, patientData[bed.id])}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg"
                  >
                    Admit
                  </button>
                ) : (
                  <button
                    onClick={() => onDischarge(deptId, ward.name, bed.id)}
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase"
                  >
                    Discharge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// --- MAIN BEDS COMPONENT ---
const Beds = () => {
  const { user } = useAuth();
  const { departments, loading, admit, discharge } = useBed();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [patientData, setPatientData] = useState({});
  const [transferData, setTransferData] = useState({});

  if (loading) return <div className="p-20 text-center">Loading Ward Data...</div>;

  const filteredDepartments = departments.map(dept => {
    const filteredWards = dept.wards.map(ward => {
      const filteredBeds = ward.beds.filter(() => ward.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return { ...ward, beds: filteredBeds };
    }).filter(ward => ward.beds.length > 0);
    return { ...dept, wards: filteredWards };
  }).filter(dept => dept.wards.length > 0);

  const departmentsToDisplay = searchTerm ? filteredDepartments : departments;
  const currentDepartment = selectedDepartment || (departmentsToDisplay.length > 0 ? departmentsToDisplay[0] : null);

  const handlePatientInputChange = (bedId, field, value) => {
    setPatientData(prev => ({
      ...prev,
      [bedId]: { ...prev[bedId], [field]: value }
    }));
  };

  const handleTransferChange = (bedId, field, value) => {
    setTransferData(prev => ({
      ...prev,
      [bedId]: { 
        ...prev[bedId], 
        [field]: value,
        ...(field === 'deptId' ? { wardName: '', targetBedId: '' } : {}),
        ...(field === 'wardName' ? { targetBedId: '' } : {})
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:w-72 lg:border-r lg:border-slate-100`}>
        <div className="p-8 border-b border-slate-50 font-black text-slate-900 italic uppercase text-2xl">
          Departments
        </div>
        <nav className="p-4 space-y-3">
          {departmentsToDisplay.map((dept) => (
            <button
              key={dept._id}
              onClick={() => { setSelectedDepartment(dept); setIsSidebarOpen(false); }}
              className={`w-full text-left p-5 rounded-[1.5rem] transition-all duration-300 font-bold text-sm ${currentDepartment?._id === dept._id ? "bg-indigo-600 text-white shadow-xl translate-x-2" : "text-slate-400 hover:bg-slate-50"}`}
            >
              {dept.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-4 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <GoBack />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-4 bg-indigo-600 text-white rounded-2xl shadow-xl">
            <Menu size={24} />
          </button>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={`Search Ward...`} />

        {currentDepartment && (
          <div className="mt-12 space-y-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 flex items-center justify-center space-x-4 italic tracking-tighter">
                <Building2 className="h-12 w-12 text-indigo-600" />
                <span>{currentDepartment.name}</span>
              </h1>
            </div>

            {currentDepartment.wards.map((ward, idx) => (
              <div key={idx} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-10">
                  <div className="p-5 bg-indigo-50 rounded-3xl text-indigo-600">
                    <Hospital size={40} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">{ward.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Live Status</p>
                  </div>
                </div>
                <WardBedContainer 
                  ward={ward} 
                  deptId={currentDepartment._id} 
                  departments={departments}
                  patientData={patientData}
                  transferData={transferData}
                  onPatientChange={handlePatientInputChange}
                  onTransferChange={handleTransferChange}
                  onAdmit={admit}
                  onDischarge={discharge}
                  user={user}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Beds;