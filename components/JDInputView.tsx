"use client";
import { useState } from "react";
import axios from "axios";
import { BrainCircuit, Loader2, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";
import candidatesData from "@/public/candidates.json";

export default function JDInputView({ onParsed }: { onParsed: (data: any, matches: any[]) => void }) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/process-jd", { jdText });
      const parsedJD = res.data;

      const matches = candidatesData.map((c: any) => {
        const jdSkills = parsedJD.requiredSkills.map((s: string) => s.toLowerCase().trim());
        const common = c.skills.filter((s: string) => {
          const candidateSkill = s.toLowerCase().trim();
          return jdSkills.includes(candidateSkill);
        });
        const matchScore = parsedJD.requiredSkills.length > 0 
          ? Math.round((common.length / parsedJD.requiredSkills.length) * 100) 
          : 0;
        
        return { ...c, matchScore, commonSkills: common, finalScore: matchScore };
      })
      .filter(c => c.matchScore > 40) 
      .sort((a, b) => b.matchScore - a.matchScore);

      onParsed(parsedJD, matches);
    } catch (err) {
      alert("Parsing failed. Check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agent Discovery</h2>
            <p className="text-slate-400 text-sm font-medium">Initialize technical talent matching</p>
          </div>
        </div>

        <div className="relative group">
          <textarea 
            className="w-full h-72 p-6 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all bg-slate-50/50 text-slate-700 placeholder:text-slate-300 resize-none font-medium text-lg leading-relaxed"
            placeholder="Paste your Job Description requirements here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 text-slate-300 group-focus-within:text-indigo-400 transition-colors">
            <Sparkles size={24} />
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !jdText.trim()} 
          className="mt-8 w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-100"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Send size={20} />
              <span className="uppercase tracking-widest text-sm">Start Analysis</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}