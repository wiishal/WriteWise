
export interface UserWriting {
  subject:string;
  writing: string;
}


export interface emailAnalysis {
  emailId:number,
  userWriting:string
}


export interface EmailTask {
  id: number;
  subject: string;
  audience: string;
  tone: string;
  purpose: string;
  hint?: string;
  example?: string;
}
export interface EmailTaskWithWriting extends EmailTask {
  writing: string;
}


export interface EmailAnalysisPayload {
  subject: string;
  audience: string;
  tone: string;
  purpose: string;
  writing: string;
}


export type WritingAnalysis = {
  clarityScore: number;
  structureScore: number;
  grammerScore: number;
  feedback: string;
};

export type EmailAnalysis = {
  clarityScore: number;
  structureScore: number;
  toneMatch: string;
  feedback: string;
};

export type Analysis = (WritingAnalysis & {subject?:string,userWritings?:string}) 
