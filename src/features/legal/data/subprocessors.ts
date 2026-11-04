export interface Subprocessor {
  name: string;
  description: string;
}

export const SUBPROCESSORS: Subprocessor[] = [
  { name: "Supabase", description: "authentication and account database." },
  { name: "Vercel Blob", description: "private temporary media storage during upload and transcription." },
  { name: "Groq", description: "speech transcription of uploaded media and translation of transcript text when requested." },
];
