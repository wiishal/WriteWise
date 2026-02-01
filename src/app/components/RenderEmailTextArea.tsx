import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ShowError from "./ShowError";

import Loading from "./ui/Loading";

import { useUser } from "@clerk/nextjs";
import EmailAnalysisCard from "./EmailAnalysisCard";
import {
  EmailAnalysis,
  EmailAnalysisPayload,
  EmailTask,
  EmailTaskWithWriting,
} from "@/types/type";
import {
  getEmailAnalysisController,
  getEmailTasksController,
} from "@/controllers/controller.email";
import { updateEmailLevel } from "@/services/service.email";

export default function RenderEmailTextArea({ level }: { level: number }) {

  const router = useRouter();
  const { isSignedIn } = useUser();

  const [isLoading, setIsLoading] = useState<boolean>(true); // whole page state
  const [isAnalyzing, setIsAnalyzing] = useState(false); //only for analysis

  const [error, setError] = useState<string | null>(null); 
  const [showEmailExample, setShowEmailExample] = useState(false); 

  const [emailTask, setEmailTasks] = useState<EmailTaskWithWriting[]>([]); // array of tasks
  const [emailIndex, setEmailIndex] = useState<number>(0); // index determines which task it is on

  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const analysisDivRenderRef = useRef<HTMLDivElement | null>(null);

  async function getAnalysisFunc() {

    const current = emailTask[emailIndex];
    if (!current?.writing.trim()) return;

    const emailData: EmailAnalysisPayload = {
      subject: current.subject,
      audience: current.audience,
      tone: current.tone,
      purpose: current.purpose,
      writing: current.writing,
    };

    setIsAnalyzing(true);
    setError(null)

    const res = await getEmailAnalysisController(emailData);
    if (!res.success) {
      setError(res.message);
      setIsAnalyzing(false);
      return;
    }
    setAnalysis(res.analysis);
    setIsAnalyzing(false);
  }


  async function getEmailTasksFunc() {

    const res = await getEmailTasksController(level);
    if (!res.success || !res.tasks) {
      setError(res.message);
      setIsLoading(false);
      return;
    }

    const withWriting = res.tasks.map((task: EmailTask) => ({
      ...task,
      writing: "",
    }));

    setEmailTasks(withWriting);
    setIsLoading(false);
  }

  function handleBtnEvent(direction: "prev" | "next") {
    setAnalysis(null);
    if (direction === "prev" && emailIndex > 0) {
      setEmailIndex((prev) => prev - 1);
    }
    if (direction === "next" && emailIndex < emailTask.length - 1) {
      setEmailIndex((prev) => prev + 1);
    }
  }

  const handleWritingChange = useCallback(
    (value: string) => {
      setEmailTasks((prev) =>
        prev.map((item, index) =>
          index === emailIndex ? { ...item, writing: value } : item,
        ),
      );
    },
    [emailIndex],

  );

  const fetchNextLevelEmailTasks = async () => {

    if (!isSignedIn) {
      router.push(`/email?level=2`);
      return;
    }

    const res = await updateEmailLevel();
    if (!res.success) {
      setError("Failed to update email level");
      return;
    }

    router.push(`/email?level=${level + 1}`);

  };

  useEffect(() => {

    setEmailIndex(0);
    getEmailTasksFunc();

  }, [level]);

  useEffect(() => {

    analysisDivRenderRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  }, [analysis]);

  if (isLoading) return <Loading />;

  if (emailTask.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-red-50 border-2 border-red-300 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-red-800 mb-2">
          No Email Tasks Found
        </h3>
        <p className="text-red-600">Error getting email tasks</p>
      </div>
    );
  }

  const current = emailTask[emailIndex];
  const wordCount =
    current?.writing?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto space-y-16 sm:py-12 px-4">
      <div className="flex items-center justify-between p-1">
        <h1 className="text-4xl font-extrabold p-2">
          Email{" "}
          <span className="font-medium text-2xl">
            {emailIndex + 1} / {emailTask.length}
          </span>
        </h1>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Email subject</label>
        <p className="border px-3 py-2 rounded bg-accent">
          {emailIndex + 1}. {current.subject}
        </p>

        {(current.audience || current.tone) && (
          <p className="text-sm text-muted-foreground mt-1 italic">
            Audience: {current.audience} · Tone: {current.tone}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="font-medium">Write here</label>
          <span className="text-sm text-muted-foreground">
            {wordCount} words
          </span>
        </div>

        {current.hint && (
          <p className="text-sm text-muted-foreground italic">
            Hint: {current.hint}
          </p>
        )}

        <textarea
          value={current.writing || ""}
          className="border px-3 py-3 rounded-xl bg-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm whitespace-pre-wrap"
          onChange={(e) => handleWritingChange(e.target.value)}
          rows={10}
          placeholder={`Greeting\n \nPurpose of email\n \nDetails\n \nClosing`}
        />
      </div>

      <div className="flex lg:flex-row lg:justify-between flex-col gap-3">
        <div className=" flex justify-between">
          <button
            disabled={emailIndex === 0}
            className="border px-4 py-2 text-sm rounded disabled:opacity-50 cursor-pointer"
            onClick={() => handleBtnEvent("prev")}
          >
            Previous
          </button>

          {emailIndex === emailTask.length - 1 ? (
            <button
              onClick={() => fetchNextLevelEmailTasks()}
              className="border px-4 py-2 text-sm rounded ml-4 disabled:opacity-50 cursor-pointer focus:bg-blend-color"
            >
              Next level
            </button>
          ) : (
            <button
              disabled={emailIndex === emailTask.length - 1}
              className="border px-4 py-2 text-sm rounded ml-4 disabled:opacity-50 cursor-pointer focus:bg-blend-color"
              onClick={() => handleBtnEvent("next")}
            >
              Next
            </button>
          )}
        </div>

        <div className="flex lg:flex-row lg:justify-between justify-between gap-3">
          <button
            onClick={() => setShowEmailExample((prev) => !prev)}
            className="border px-4 py-2 text-sm  rounded bg-accent disabled:opacity-50 cursor-pointer"
          >
            {showEmailExample ? "Close" : "Show example"}
          </button>
          <button
            disabled={!current.writing.trim() || isAnalyzing}
            className="border rounded-sm px-6 py-2 font-medium text-sm disabled:opacity-50 cursor-pointer hover:bg-accent hover:text-primary transition bg-primary text-primary-foreground"
            onClick={getAnalysisFunc}
          >
            {isAnalyzing ? "Analyzing..." : analysis ? "Re-analyze" : "Analyze"}
          </button>
        </div>
      </div>

      {showEmailExample && (
        <div className="border px-3 py-3 rounded-xl bg-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm whitespace-pre-wrap transition">
          <p className="text-sm text-muted-foreground italic">
            Note: This is just a example, use your word to write email. Don't
            copy
          </p>
          {emailTask[emailIndex]?.example}
        </div>
      )}

      {error && <ShowError error={error} closeErrorPopUp={setError} />}

      <div className="" ref={analysisDivRenderRef}>
        {isAnalyzing && "Analysing..."}
        {analysis && <EmailAnalysisCard analysis={analysis} />}
      </div>
    </div>
  );
}
