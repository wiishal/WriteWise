import { useEffect, useRef, useState } from "react";
import Loading from "./ui/Loading";
import { AnalysisCard } from "./AnalysisCard";
import ShowError from "./ShowError";
import { getAnalysisController } from "@/controllers/controller.write";
import { Analysis, UserWriting, WritingAnalysis } from "@/types/type";

type WritingPurpose = "explain" | "persuade" | "reflect" | "request";

export default function RenderTextArea() {
  const [isAnalyzing, setIsAnalyzing] = useState(false); // only determines analysis state
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [text, setText] = useState(""); // user writing state

  const [purpose, setPurpose] = useState<WritingPurpose>("explain");
  const [analysis, setAnalysis] = useState<Analysis | null>();

  const analysisDivRenderRef = useRef<HTMLDivElement | null>(null);

  async function getAnalysisFunc() {
    if (!subject.trim() || !text.trim()) return;

    const writings: UserWriting & { purpose: WritingPurpose } = {
      subject,
      writing: text,
      purpose,
    };

    setAnalysis(null);
    setError(null);
    setIsAnalyzing(true);

    const res = await getAnalysisController(writings);
    if (!res.success) {
      console.log(res, "error");
      setError(res.message || "Analysis failed");
      setIsAnalyzing(false);
      return;
    }

    const analysis: WritingAnalysis & {
      subject: string;
      userWritings: string;
    } = {
      ...res.analysis,
      subject: subject,
      userWritings: text,
    };

    setAnalysis(analysis);
    setIsAnalyzing(false);
  }
  const scrollToAnalysisDiv = () => {
    analysisDivRenderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToAnalysisDiv();
  }, [analysis]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto space-y-16 sm:py-12 px-4">
      <div className="flex flex-row justify-between border-b pb-4">
        <div className="flex gap-4">
          <h1 className="text-4xl font-extrabold">Write</h1>
          {error && <ShowError error={error} closeErrorPopUp={setError} />}
        </div>
        <button
          disabled={!subject.trim() || !text.trim()}
          className="border rounded-sm px-6 py-2 font-medium text-sm disabled:opacity-50 cursor-pointer hover:bg-accent hover:text-primary transition bg-primary text-primary-foreground"
          onClick={getAnalysisFunc}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Subject of writing</label>
        <textarea
          className="border px-3 py-2 rounded-xl bg-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="What do you want to write about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as WritingPurpose)}
          className="border px-3 py-2 rounded bg-accent"
        >
          <option value="explain">Explain</option>
          <option value="persuade">Persuade</option>
          <option value="reflect">Reflect</option>
          <option value="request">Request</option>
        </select>

        <p className="text-sm text-muted-foreground">
          Purpose helps AI evaluate clarity and tone correctly.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="font-medium">Write here</label>
          <span className="text-sm text-muted-foreground">
            {wordCount} words
          </span>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Tip: Write as if you are explaining this to a real person.
        </p>

        <textarea
          className="border px-3 py-3 rounded-xl bg-accent focus:outline-none focus:ring-1 focus:ring-accent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={`Opening thought\n \nMain idea\n \nSupporting points\n \nConclusion`}
        />
      </div>

      <div ref={analysisDivRenderRef}>
        {isAnalyzing ? "Processing...." : ""}
        {analysis && (
          <div className="border px-3 py-3 rounded-xl bg-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm whitespace-pre-wrap transition">
            <AnalysisCard analysis={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}
