import React, { useState, useEffect, useRef, memo } from 'react';
import { Bed, ArrowRightLeft, UserPlus, Save, Stethoscope, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const WardBedContainer = memo(({ ward, deptId, departments, patientData, transferData, onPatientChange, onTransferChange, onAdmit, onDischarge, onSaveInfo, user }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return; 
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
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
        className="flex flex-nowrap overflow-x-scroll gap-6 pb-6 snap-x scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ward.beds.map((bed) => {
          // Data Extraction
          const currentName = patientData[bed.id]?.name ?? bed.patient?.name ?? "";
          const currentAge = patientData[bed.id]?.age ?? bed.patient?.age ?? "";
          const currentSex = patientData[bed.id]?.sex ?? bed.patient?.sex ?? "";
          const currentComplaint = patientData[bed.id]?.chiefComplaint ?? bed.patient?.chiefComplaint ?? "";
          
          // Prediction Object Extraction
          const currentDiagnosis = patientData[bed.id]?.prediction?.diagnosis ?? bed.patient?.prediction?.diagnosis ?? "";
          const currentRiskLevel = patientData[bed.id]?.prediction?.riskLevel ?? bed.patient?.prediction?.riskLevel ?? "";

          const tData = transferData[bed.id] || {};
          const tDept = departments.find(d => d._id === tData.deptId);
          const tWard = tDept?.wards.find(w => w.name === tData.wardName);
          const tAvailableBeds = tWard?.beds.filter(b => b.status === "available") || [];

          return (
            <div
              key={bed.id}
              className={`flex-shrink-0 w-[320px] md:w-[420px] snap-center p-6 rounded-[3rem] border-2 transition-all duration-300 ${
                bed.status === "occupied" ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"
              }`}
            >
              {/* Transfer Section */}
              {bed.status === "occupied" && (
                <div className="mb-4 p-4 bg-white rounded-[1.5rem] border border-indigo-100 shadow-sm">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ArrowRightLeft size={14} /> Transfer Protocol:
                  </p>
                  <div className="space-y-2">
                    <select 
                      value={tData.deptId || ""}
                      onChange={(e) => onTransferChange(bed.id, 'deptId', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 font-bold"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>

                    {tData.deptId && (
                      <select 
                        value={tData.wardName || ""}
                        onChange={(e) => onTransferChange(bed.id, 'wardName', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 font-bold"
                      >
                        <option value="">Select Ward</option>
                        {tDept.wards.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                      </select>
                    )}

                    {tData.wardName && (
                      <select 
                        value={tData.targetBedId || ""}
                        onChange={(e) => onTransferChange(bed.id, 'targetBedId', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 font-bold"
                      >
                        <option value="">Select Bed</option>
                        {tAvailableBeds.map(b => <option key={b.id} value={b.id}>Bed {b.id}</option>)}
                      </select>
                    )}

                    <button 
                      disabled={!tData.targetBedId}
                      className={`w-full text-white text-[10px] font-black py-2.5 rounded-xl transition-all uppercase tracking-widest ${
                        !tData.targetBedId ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                      }`}
                      onClick={() => toast.success("Transfer Active")}
                    >
                      Initialize Transfer
                    </button>
                  </div>
                </div>
              )}

              {/* Bed Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl shadow-sm ${bed.status === 'occupied' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    <Bed size={20} />
                  </div>
                  <div>
                    <p className="font-black text-xl text-slate-800 uppercase italic tracking-tighter">Bed {bed.id}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                      {bed.status === "occupied" ? "In-Patient" : "Ready"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="space-y-3 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                  <UserPlus size={14} className="text-indigo-500" /> Administrative Info
                </p>
                
                <input 
                  placeholder="Full Name"
                  value={currentName}
                  className="w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  onChange={(e) => onPatientChange(bed.id, 'name', e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" placeholder="Age" value={currentAge}
                    className="p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 font-bold outline-none"
                    onChange={(e) => onPatientChange(bed.id, 'age', e.target.value)}
                  />
                  <select 
                    value={currentSex}
                    className="p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 font-bold outline-none"
                    onChange={(e) => onPatientChange(bed.id, 'sex', e.target.value)}
                  >
                    <option value="">Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <textarea 
                  placeholder="Chief Complaint..." value={currentComplaint}
                  className="w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 h-16 resize-none font-medium outline-none"
                  onChange={(e) => onPatientChange(bed.id, 'chiefComplaint', e.target.value)}
                />

                {/* CLINICAL PREDICTION SECTION */}
                <div className="pt-2 border-t border-slate-50 space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Stethoscope size={14} className="text-rose-500" /> Medical Prediction
                  </p>
                  
                  <textarea 
                    placeholder="Diagnosis / Prediction..." 
                    value={currentDiagnosis}
                    className="w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 h-16 resize-none font-medium outline-none"
                    onChange={(e) => onPatientChange(bed.id, 'prediction', { diagnosis: e.target.value })}
                  />

                  <div className="relative">
                    <select 
                      value={currentRiskLevel}
                      className={`w-full p-3 text-sm rounded-xl border border-slate-100 bg-slate-50 font-black outline-none appearance-none ${
                        currentRiskLevel === 'high' ? 'text-red-600' : 
                        currentRiskLevel === 'medium' ? 'text-amber-600' : 
                        currentRiskLevel === 'low' ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                      onChange={(e) => onPatientChange(bed.id, 'prediction', { riskLevel: e.target.value })}
                    >
                      <option value="">Select Risk Level</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                    <AlertCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* SYNC / SAVE BUTTON WITH VALIDATION */}
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md mt-2"
                  onClick={() => {
                    const patient = patientData[bed.id];

                    // --- Front-end Validation before Context Call ---
                    if (!patient?.name?.trim()) return toast.error("Name is required");
                    if (!patient?.age) return toast.error("Age is required");
                    if (!patient?.sex) return toast.error("Please select Sex");
                    if (!patient?.chiefComplaint?.trim()) return toast.error("Complaint is required");

                    const info = {
                      deptId,
                      wardName: ward.name,
                      bedId: bed.id,
                      patient: patient
                    };
                    onSaveInfo(info);
                  }}
                >
                  <Save size={14} /> Sync to Registry
                </button>

                <div className="h-[1px] bg-slate-100 my-2" />

                {bed.status === "available" ? (
                  <button 
                    onClick={() => onAdmit(deptId, ward.name, bed.id, patientData[bed.id])}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Confirm Admission
                  </button>
                ) : (
                  <button
                    onClick={() => onDischarge(deptId, ward.name, bed.id)}
                    className="w-full py-4 bg-white border-2 border-red-100 text-red-600 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all"
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