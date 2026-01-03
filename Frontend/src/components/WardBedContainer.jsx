import React, { useState, useEffect, useRef, memo } from 'react';
import { Bed, ArrowRightLeft, UserPlus, Save, Stethoscope, AlertCircle, Sparkles, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAIPrediction } from '../services/aiService';

const WardBedContainer = memo(({ ward, deptId, departments, patientData, transferData, onPatientChange, onTransferChange, onAdmit, onDischarge, onSaveInfo, user }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [tempPrediction, setTempPrediction] = useState({}); // Local state for pending AI answers

  // --- Auto-Scroll Logic ---
  const [see, setSee] = useState(false);
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

  // --- AI Prediction Function with Staging ---
  const handleAIPrediction = async (bedId, complaint) => {
    if (!complaint) {
      return toast.error("Please enter a chief complaint first");
    }

    const loadingToast = toast.loading("AI is analyzing symptoms...");
    try {
      const data = await getAIPrediction(complaint);
      
      // Store in temp state instead of immediate update
      setTempPrediction(prev => ({
        ...prev,
        [bedId]: { diagnosis: data.diagnosis, riskLevel: data.riskLevel }
      }));

      toast.success("AI Analysis Complete. Please review.", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("AI service currently unavailable", { id: loadingToast });
    }
  };

  const acceptPrediction = (bedId) => {
    const prediction = tempPrediction[bedId];
    onPatientChange(bedId, 'prediction', prediction);
    setTempPrediction(prev => {
      const newState = { ...prev };
      delete newState[bedId];
      return newState;
    });
    toast.success("Diagnosis applied");
  };

  const rejectPrediction = (bedId) => {
    setTempPrediction(prev => {
      const newState = { ...prev };
      delete newState[bedId];
      return newState;
    });
    toast.error("AI suggestion discarded");
  };

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex flex-nowrap overflow-x-scroll gap-6 pb-6 snap-x scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ward.beds.map((bed) => {
          const currentName = patientData[bed.id]?.name ?? bed.patient?.name ?? "";
          const currentAge = patientData[bed.id]?.age ?? bed.patient?.age ?? "";
          const currentSex = patientData[bed.id]?.sex ?? bed.patient?.sex ?? "";
          const currentComplaint = patientData[bed.id]?.chiefComplaint ?? bed.patient?.chiefComplaint ?? "";
          
          const currentDiagnosis = patientData[bed.id]?.prediction?.diagnosis ?? bed.patient?.prediction?.diagnosis ?? "";
          const currentRiskLevel = patientData[bed.id]?.prediction?.riskLevel ?? bed.patient?.prediction?.riskLevel ?? "";

          const pendingAI = tempPrediction[bed.id];

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
              {/* Transfer Section (Existing) */}
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
                    <p 
                    onClick={() => {setSee(!see); toast.success("Please Pay Subscription to see Assigned Persion's name.")}} 
                    className="cp border-b-2 text-[10px] font-black text-slate-900 uppercase italic cursor-pointer"
                    >
                      {see ? 'Assigned To' : 'Is Assigned'} : {see ? (bed.assignedUser?.name || 'None') : (bed.assignedUser ? 'Yes' : 'No')}
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
                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Stethoscope size={14} className="text-rose-500" /> Medical Diagnosis
                    </p>
                    <button 
                      type="button"
                      onClick={() => handleAIPrediction(bed.id, currentComplaint)}
                      className="cp animate-pulse text-[9px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-full font-black hover:scale-105 transition-all flex items-center gap-1 shadow-md shadow-indigo-100"
                    >
                      <Sparkles size={10} /> AI ASSIST
                    </button>
                  </div>
                  
                  {/* Diagnosis Input (User can always edit this) */}
                  <div className={`relative rounded-2xl p-0.5 bg-gradient-to-br ${
                    currentRiskLevel === 'high' ? 'from-red-200 to-rose-100' : 
                    currentRiskLevel === 'medium' ? 'from-amber-200 to-orange-100' : 
                    currentRiskLevel === 'low' ? 'from-emerald-200 to-teal-100' : 'from-slate-200 to-slate-100'
                  }`}>
                    <textarea 
                      placeholder="Enter clinical diagnosis..." 
                      value={currentDiagnosis}
                      className="w-full p-3 text-sm rounded-[calc(1rem-2px)] bg-white/90 backdrop-blur-sm h-20 resize-none font-bold text-slate-700 outline-none border-none"
                      onChange={(e) => onPatientChange(bed.id, 'prediction', { diagnosis: e.target.value })}
                    />
                  </div>

                  {/* AI REVIEW OVERLAY - Only shows after clicking AI ASSIST */}
                  {pendingAI && (
                    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl animate-in slide-in-from-top duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">AI Suggestion:</span>
                        <div className="flex gap-1">
                           <button onClick={() => acceptPrediction(bed.id)} className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"><Check size={14}/></button>
                           <button onClick={() => rejectPrediction(bed.id)} className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"><X size={14}/></button>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-700 italic">"{pendingAI.diagnosis}"</p>
                      <span className={`text-[9px] font-black uppercase mt-1 inline-block ${pendingAI.riskLevel === 'high' ? 'text-red-500' : 'text-emerald-500'}`}>
                        Risk: {pendingAI.riskLevel}
                      </span>
                    </div>
                  )}

                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none z-10 ${
                       currentRiskLevel === 'high' ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      <AlertCircle size={16} />
                    </div>
                    <select 
                      value={currentRiskLevel}
                      className={`w-full pl-10 pr-4 py-3 text-xs rounded-xl border-2 font-black outline-none appearance-none transition-all ${
                        currentRiskLevel === 'high' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                      onChange={(e) => onPatientChange(bed.id, 'prediction', { riskLevel: e.target.value })}
                    >
                      <option value="">Risk Level</option>
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md mt-2"
                  onClick={() => {
                    const patient = patientData[bed.id];
                    if (!patient?.name?.trim()) return toast.error("Name is required");
                    onSaveInfo({ deptId, wardName: ward.name, bedId: bed.id, patient: patient });
                  }}
                >
                  <Save size={14} /> Sync to Registry
                </button>

                <div className="h-[1px] bg-slate-100 my-2" />

                <button 
                  onClick={() => bed.status === "available" ? onAdmit(deptId, ward.name, bed.id, patientData[bed.id]) : onDischarge(deptId, ward.name, bed.id)}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase transition-all ${
                    bed.status === "available" ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700" : "bg-white border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {bed.status === "available" ? "Confirm Admission" : "Discharge"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default WardBedContainer;