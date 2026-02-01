import { saveAnalysisController } from "@/controllers/controller.write";
import { Analysis } from "@/types/type";
import { useState } from "react";
import ShowError from "./ShowError";
import ShowNotification from "./ShowNotification";

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAnalysing,setIsAnalyzing] = useState<boolean>(false)
  async function saveProcessFunc() {
    setIsAnalyzing(true)
    const payload = {
      ...analysis,
      subject: "user provided subject",
      userWritings: "user writings",
    };
    const res = await saveAnalysisController(payload);
    if (!res.success) {
      setError(res.message);
      setIsAnalyzing(false)
      return;
    }
    console.log(res);
    setNotification(res.message)
    setIsAnalyzing(false)
  }
  return (
    <div className="border rounded-xl p-6 bg-accent space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">Writing Analysis</h2>
          {error && <ShowError error={error} closeErrorPopUp={setError} />}
          {notification && (
            <ShowNotification message={notification} closeNotificationPopUp={setNotification} />
          )}
        </div>
        <button
          onClick={saveProcessFunc}
          className="border rounded-sm px-6 py-2 font-medium text-sm disabled:opacity-50 cursor-pointer hover:bg-accent hover:text-primary transition bg-accent-foreground text-accent"
        >
          {isAnalysing ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ScoreBox label="Clarity" value={analysis.clarityScore} />
        <ScoreBox label="Structure" value={analysis.structureScore} />
        <ScoreBox label="Grammar" value={analysis.grammerScore} />
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium">Feedback</p>
        <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
      </div>
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 border rounded-lg text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}/100</p>
    </div>
  );
}
