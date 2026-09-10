export interface Subprocessor {
  name: string;
  description: string;
}

export const SUBPROCESSORS: Subprocessor[] = [
  { name: "Hostinger", description: "hosting for the servers that run Replix Captions." },
  { name: "Supabase", description: "authentication and account database." },
  { name: "Cloudflare R2", description: "temporary media storage during upload and processing." },
  { name: "Modal", description: "cloud computing used to render your captioned video." },
  { name: "Sarvam AI, ElevenLabs, OpenAI", description: "speech and language processing for transcription and caption generation." },
  { name: "kie.ai", description: "AI image generation for the thumbnail feature. When you generate a thumbnail, your saved photo (if you chose one) is made available to kie.ai through a short-lived private link, together with the text prompt." },
  { name: "Google (Gemini API)", description: "AI image generation for the thumbnail feature, used as a backup provider." },
  { name: "Razorpay", description: "payment processing." },
  { name: "ZeptoMail and Resend", description: "transactional email delivery for account, security, and service emails." },
  { name: "Product analytics and error monitoring providers", description: "usage measurement and crash reporting to help us improve reliability." },
  { name: "Device identification for abuse prevention", description: "a browser-based check used only to reduce duplicate or abusive signups." },
  { name: "Tally", description: "support form hosting; optional screenshot attachments are stored on Tally's servers (EU) until the ticket is resolved." },
  { name: "MSG91 / 2Factor.in", description: "SMS delivery of one-time verification codes, if phone verification is enabled. They receive your phone number only to deliver the code." },
  { name: "Cloudflare Turnstile", description: "bot protection on sign-in and signup forms, when enabled. Turnstile checks that a request comes from a person; we do not receive any profile data from it." },
];
