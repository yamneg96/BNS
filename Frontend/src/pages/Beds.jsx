import React, { useState } from "react";
import { Menu, X, Hospital, Bed, User, Building2, Timer, ArrowRightLeft, UserPlus, Save, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBed } from "../context/BedContext";
import toast from "react-hot-toast";
import GoBack from '../components/GoBack';
import SearchBar from '../components/SearchBar';
import WardBedContainer from "../components/WardBedContainer";

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