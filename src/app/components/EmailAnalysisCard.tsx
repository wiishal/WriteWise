import { EmailAnalysis } from "@/types/type";

export default function EmailAnalysisCard({
  analysis,
}: {
  analysis: EmailAnalysis;
}) {



  return (
    <div className="border rounded-xl p-6 bg-accent space-y-5 shadow-sm">
      <h2 className="text-xl font-semibold">Email Analysis</h2>
      <button>Save</button>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Clarity</p>
          <p className="text-3xl font-bold">{analysis.clarityScore}/10</p>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Structure</p>
          <p className="text-3xl font-bold">{analysis.structureScore}/10</p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Tone Match</p>
        <p className="font-medium">{analysis.toneMatch}</p>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium">Feedback</p>
        <p className="text-sm text-muted-foreground">
          {analysis.feedback}
        </p>
      </div>
    </div>
  );
}
