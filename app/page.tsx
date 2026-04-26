"use client";
import { useState } from "react";
import JDInputView from "@/components/JDInputView";
import CandidateDashboard from "@/components/CandidateDashboard";

export default function TalentAgent() {
  const [jdData, setJdData] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleJDParsed = (data: any, initialMatches: any[]) => {
    setJdData(data);
    setResults(initialMatches);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {!jdData ? (
        <JDInputView onParsed={handleJDParsed} />
      ) : (
        <CandidateDashboard 
          jdData={jdData} 
          initialResults={results} 
          onReset={() => setJdData(null)} 
        />
      )}
    </div>
  );
}