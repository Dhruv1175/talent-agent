"use client";
import { useState } from "react";
import axios from "axios";
import { PlusCircle, X, Star, Loader2, Target, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CandidateDashboard({ jdData, initialResults, onReset }: any) {
  const [results, setResults] = useState(initialResults);
  const [engagingId, setEngagingId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [showResumeInput, setShowResumeInput] = useState(false);

  // Re-usable Progress Bar Component
  const MetricBar = ({ label, value, colorClass }: any) => (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${value}%` }} 
          className={`h-full ${colorClass} rounded-full`}
        />
      </div>
    </div>
  );

  const handleAddCandidate = async () => {
    try {
      const res = await axios.post("/api/parse-resume", { resumeText });
      const newC = res.data;
      const common = newC.skills.filter((s: string) => 
        jdData.requiredSkills.some((rs: string) => rs.toLowerCase().includes(s.toLowerCase()))
      );
      const matchScore = Math.round((common.length / jdData.requiredSkills.length) * 100);
      
      const candidate = { ...newC, id: Date.now().toString(), matchScore, finalScore: matchScore };
      if (matchScore > 40) {
      setResults((prev: any) => [candidate, ...prev].sort((a: any, b: any) => b.finalScore - a.finalScore));
      setShowResumeInput(false);
      setResumeText("");}
      else{
      setShowResumeInput(false);
      setResumeText("");
      }
    } catch (err) { alert("Error parsing candidate."); }
  };

  const handleEngage = async (id: string) => {
    setEngagingId(id);
    try {
      const candidate = results.find((c: any) => c.id === id);
      const res = await axios.post("/api/engage", { candidate, jd: jdData });
      setResults((prev: any) => prev.map((c: any) => {
        if (c.id === id) {
          const total = Math.round((c.matchScore * 0.7) + (res.data.interestScore * 0.3));
          return { ...c, interestScore: res.data.interestScore, explanation: res.data.explanation, finalScore: total };
        }
        return c;
      }).sort((a: any, b: any) => b.finalScore - a.finalScore));
    } finally { setEngagingId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
           <div className="flex items-center gap-4">
             <div className="bg-indigo-600 text-white p-2 rounded-xl">
               <Target size={20} />
             </div>
             <div>
                <h1 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">
                  {jdData.role}
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Match Accuracy Enabled
                </span>
             </div>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setShowResumeInput(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-2">
               <PlusCircle size={14} /> Add Candidate
             </button>
             <button onClick={onReset} className="p-2.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
               <X size={18} />
             </button>
           </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-10 px-6 space-y-6">
        {results.map((c: any, idx: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            key={c.id} 
            className="group bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-10">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{c.name}</h3>
                    {c.finalScore >= 80 && (
                      <span className="bg-amber-100 text-amber-700 p-1 rounded-lg">
                        <Award size={16} />
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{c.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.skills.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-slate-100/50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                  {c.explanation && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm text-indigo-900 font-medium leading-snug">
                      <Zap size={14} className="inline mr-2 text-indigo-500" fill="currentColor"/>
                      {c.explanation}
                    </motion.div>
                  )}
               </div>

               <div className="md:w-56 flex flex-col justify-between bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                  <div className="space-y-4">
                    <MetricBar label="Tech Match" value={c.matchScore} colorClass="bg-indigo-500" />
                    <MetricBar label="Interest Score" value={c.interestScore || 0} colorClass="bg-emerald-500" />
                  </div>
                  
                  <div className="mt-8">
                    {c.interestScore !== undefined ? (
                      <div className="bg-slate-900 text-white rounded-2xl p-4 text-center shadow-lg shadow-slate-200">
                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Final Score</div>
                        <div className="text-3xl font-black tracking-tighter">{c.finalScore}</div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEngage(c.id)} 
                        disabled={engagingId === c.id} 
                        className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {engagingId === c.id ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Validate Interest"}
                      </button>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {showResumeInput && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800">Add New Talent</h3>
                <button onClick={() => setShowResumeInput(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 transition-colors">
                  <X className='text-black' size={20} />
                </button>
              </div>
              <textarea 
                className="w-full h-56 p-6 border-2 border-slate-100 rounded-[1.5rem] mb-6 bg-slate-50 text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none font-medium"
                placeholder="Paste Resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <button 
                onClick={handleAddCandidate} 
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-colors"
              >
                Ingest Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}