"use client";

import { fetchUserWritingProgressController } from "@/controllers/controller.user";
import { useEffect, useState } from "react";

type Progress = {
  totalWritings: number;
  clarityAvg: number;
  structureAvg: number;
  grammarAvg: number;
};

export default function UserProcess() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      const res = await fetchUserWritingProgressController();
      if (!res.success) {
        setLoading(false);
        setProgress(null);
        return;
      }
      setProgress(res.progress);
      setLoading(false);
    }
    fetchProgress();
  }, []);

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Loading analytics...</div>;
  if (!progress) return <div className="p-8 text-red-400">No progress data available</div>;

  return (
    <div className="w-full h-full flex justify-center">

    <div className="max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm max-h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Writing Analytics</h2>
      </div>

      <div className="space-y-6">
        <ProgressRow label="Clarity" value={progress.clarityAvg} color="bg-emerald-500" />
        <ProgressRow label="Structure" value={progress.structureAvg} color="bg-blue-500" />
        <ProgressRow label="Grammar" value={progress.grammarAvg} color="bg-purple-500" />
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
        <span className="text-sm text-zinc-400">Total documents processed</span>
        <span className="text-lg font-mono font-bold text-white">{progress.totalWritings}</span>
      </div>
    </div>
    </div>

  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}