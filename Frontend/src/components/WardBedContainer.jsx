import React, {useState, useEffect, useRef, memo} from 'react';
import {X, Bed, User, Timer, ArrowRightLeft, UserPlus, Save, LogIn} from 'lucide-react';

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

export default WardBedContainer;