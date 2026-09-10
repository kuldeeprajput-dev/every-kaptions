export type BillingInterval = "Monthly" | "One-time" | "Yearly";

export const comparisons = [
  {
    feature: "Captioning",
    free: "3 min / month",
    onetime: "10 to 25 min (one-time)",
    creator: "30 min / month",
    studio: "45 min / month",
  },
  {
    feature: "Exports",
    free: "3 / month (watermarked)",
    onetime: "Unlimited, no watermark",
    creator: "Up to 30 / day, no watermark",
    studio: "Up to 30 / day, no watermark",
  },
  {
    feature: "Style presets",
    free: "Classic, Yellow, Minimal, Dark",
    onetime: "Classic presets only",
    creator: "Creator presets: Punch, Cove, Spotlight, Reel, Noir, Gradient Fill, Frosted Glass",
    studio: "All presets, including Neon Pop and Gold Luxe",
  },
  {
    feature: "Premium fonts",
    free: "Preview all fonts; export with Poppins or Noto Sans Telugu",
    onetime: "No",
    creator: "30+ fonts: display, modern sans, Telugu lipi, retro",
    studio: "30+ fonts: display, modern sans, Telugu lipi, retro",
  },
  {
    feature: "Keyword emphasis",
    free: "Preview in editor",
    onetime: "No",
    creator: "Yes",
    studio: "Yes",
  },
  {
    feature: "Caption animation",
    free: "Preview in editor",
    onetime: "No",
    creator: "Yes",
    studio: "Yes",
  },
  {
    feature: "Glow emphasis",
    free: "Preview in editor",
    onetime: "No",
    creator: "Yes",
    studio: "Yes",
  },
  {
    feature: "Contrast padding",
    free: "Preview in editor",
    onetime: "No",
    creator: "Yes",
    studio: "Yes",
  },
  { feature: "Uploads", free: "5 / day", onetime: "5 / day", creator: "Unlimited", studio: "Unlimited" },
  { feature: "Saved exports", free: "No; exports expire after 1 hour", onetime: "No", creator: "Yes, last 50 saved", studio: "Yes, last 50 saved" },
  { feature: "Content Pack", free: "No", onetime: "No", creator: "Yes: AI titles, IG caption, hashtags", studio: "Yes: AI titles, IG caption, hashtags" },
  { feature: "Support", free: "Standard", onetime: "Priority", creator: "Priority", studio: "Priority" },
  {
    feature: "Billing",
    free: "Free forever",
    onetime: "Pay once, valid 60 to 90 days",
    creator: "₹399/mo or yearly",
    studio: "₹999/mo or ₹9,990/yr · code for launch price",
  },
  {
    feature: "Languages",
    free: "Telugu (Tanglish or Telugu lipi)",
    onetime: "Telugu (Tanglish or Telugu lipi)",
    creator: "Telugu, Hindi, and English",
    studio: "Telugu, Hindi, and English",
  },
  {
    feature: "Instagram posting",
    isNew: true,
    free: "No",
    onetime: "No",
    creator: "Post now",
    studio: "Post now plus schedule",
  },
  {
    feature: "AI thumbnails",
    free: "Not included",
    onetime: "Not included",
    creator: "Yes: 1 thumbnail per generation, 1K (15 credits/mo)",
    studio: "Yes: 2 options per generation, up to 4K (60 credits/mo)",
  },
] as const;

export const faqs = [
  {
    question: "How does billing work?",
    answer:
      "You're billed by the length of each video, rounded up to the next 15 seconds, with a 30-second minimum. So a 33-second clip uses 0.75 min and a 1:21 clip uses 1.5 min. You're charged once when a video is transcribed. The free plan includes 3 minutes of captioning and 3 exports per month; Creator includes 30 minutes per month; Studio includes 45 minutes per month. Paid plans allow up to 30 exports per day.",
  },
  {
    question: "Is the free plan really free?",
    answer:
      "Yes. You get 3 minutes and 3 exports every month with no card required. Free exports carry a small watermark. Content Pack is not included on Free; it comes with Creator or Studio.",
  },
  {
    question: "What is Creator vs Studio?",
    answer:
      "Creator (₹399/mo) removes the watermark, unlocks Creator presets (Punch, Cove, Spotlight, Reel, Noir, Gradient Fill, Frosted Glass), premium fonts, keyword emphasis, caption animation, saved exports, Content Pack (AI YouTube titles, IG caption, and hashtags from your transcript), limited AI vertical thumbnails (1 per generation, 1K, 15 credits/mo), and posting Reels to Instagram after export. Studio (₹999/mo) includes everything in Creator plus Neon Pop, Gold Luxe, 45 minutes of captioning per month, 2 thumbnail options per generation, up to 4K, 60 credits/mo, and scheduling Instagram posts up to 30 days ahead.",
    hasHtml: true,
  },
  {
    question: "What do I get with a monthly subscription?",
    answer:
      "Creator includes 30 minutes of captioning every month, up to 30 watermark-free exports per day, unlimited uploads, saved exports (your last 50), Content Pack (AI YouTube titles, IG caption, and hashtags from your transcript), Creator style presets, premium fonts, keyword emphasis, caption animation, limited AI vertical thumbnails (1 per generation, 1K, 15 credits/mo), posting Reels to Instagram after export, and priority support. Studio includes everything in Creator plus Neon Pop, Gold Luxe, 45 minutes of captioning per month, 2 thumbnail options per generation, up to 4K, 60 credits/mo, and scheduling Instagram posts up to 30 days ahead. You are billed each month until you cancel.",
  },
  {
    question: "How does monthly billing work with UPI?",
    answer:
      "Monthly plans use UPI Autopay or card. PhonePe and Paytm will ask you to set up autopay and confirm with your UPI PIN. If UPI gets stuck, try card or switch to the Yearly tab for a one-time payment.",
  },
  {
    question: "What is the difference between a one-time pack and monthly?",
    answer:
      "One-time packs give you captioning minutes and unlimited watermark-free exports for 60 to 90 days. They do not unlock Creator presets, premium fonts, saved exports, or Content Pack. Those require a Creator or Studio subscription. New videos need minutes; re-exports of videos you already transcribed are free.",
  },
  {
    question: "What happens to my styles if I downgrade or cancel?",
    answer:
      "You keep editing and previewing any style in the editor. If you export with a premium preset, premium font, keyword emphasis, or caption animation above your current tier, export is blocked with an upgrade prompt. We never silently downgrade your captions to a cheaper look.",
  },
  {
    question: "Are my exports saved?",
    answer:
      "On paid plans, your last 50 exported videos are saved in My Exports so you can download them again anytime while subscribed. Free exports are not saved; they expire about 1 hour after export.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancelling stops all future billing, and your access stays active until the end of the current paid period. Scheduled Instagram posts stay queued until that date, then they are cancelled. Reels already on Instagram stay up.",
  },
  {
    question: "Can I post to Instagram from Replix Captions?",
    answer:
      "Yes. After you export, Creator plans can post the Reel now. Studio can also pick a time up to 30 days ahead. You need an Instagram professional account (Business or Creator), not a personal profile. The video must be vertical, between 5 and 90 seconds.",
  },
  {
    question: "What happens to scheduled posts if I cancel my plan?",
    answer:
      "They stay scheduled until the end of the period you already paid for. When access ends, leftover scheduled posts are cancelled and will not go live. Reels already on Instagram stay up. If you only disconnect Instagram, scheduled posts stay in Posts; reconnect before the time and they still post.",
  },
  {
    question: "Why did a post fail?",
    answer:
      "Usual causes: personal (not professional) Instagram, video not 9:16 or outside 5 to 90 seconds, or Instagram disconnected. Failed posts stay on the Failed tab for 7 days with Retry.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Monthly plans: refund within 7 days of your first charge if you've used fewer than 3 minutes. One-time packs and yearly plans are non-refundable once any captioning minute is used or a paid export is made, except if we completely failed to deliver your purchase (100% technical failure on our side). Full details are in our Refund Policy.",
    hasRefundLink: true,
  },
  {
    question: "What videos can I upload?",
    answer: "Clips up to 3 minutes long, 1080p resolution, and 300 MB per file.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Free plans output Tanglish (Roman letters) or Telugu lipi from Telugu audio. Creator and Studio add Hindi and English spoken videos, plus English subtitles on Telugu and Hindi clips. Studio gets a bigger monthly minute pool, same languages either way.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Securely through Razorpay. Monthly plans use UPI Autopay (PhonePe/Paytm will ask you to set up autopay and enter your UPI PIN) or card. If UPI gets stuck, try Card or switch to Yearly (one-time payment, no autopay). Card details are processed by Razorpay, never stored on our servers.",
  },
] as const;

export interface SubscriptionTier {
  id: string;
  name: string;
  badge: string;
  badgeClass: string;
  recommendedInMonthly?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyNote: string;
  yearlyNote: string;
  ctaLabel: string;
  ctaVariant: "primary" | "outline";
  features: string[];
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "free",
    name: "Free",
    badge: "Free",
    badgeClass: "text-[#c8c2b6] border-[rgba(200,194,182,0.3)]",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyNote: "3 minutes every month, no card needed.",
    yearlyNote: "3 minutes every month, no card needed.",
    ctaLabel: "Start for free",
    ctaVariant: "outline",
    features: [
      "3 min of captioning / month",
      "3 exports / month (watermarked)",
      "Classic presets; preview every style in the editor",
      "30+ fonts; preview in the editor",
      "Telugu: Tanglish or Telugu lipi",
      "Watermark on exports",
      "Exports expire after 1 hour",
      "Content Pack not included",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    badge: "Creator",
    badgeClass: "text-[#c4b5fd] border-[rgba(167,139,250,0.35)]",
    recommendedInMonthly: true,
    monthlyPrice: 399,
    yearlyPrice: 333,
    monthlyNote:
      "Creator presets, premium fonts, keyword emphasis, caption animation, and limited AI vertical thumbnails (1 per generation, 1K, 15 credits/mo).",
    yearlyNote: "Billed ₹3,990/yr. Pay 10 months, get 12 (2 months free).",
    ctaLabel: "Subscribe",
    ctaVariant: "primary",
    features: [
      "30 min of captioning / month",
      "Up to 30 watermark-free exports / day",
      "Unlimited uploads",
      "Saved exports; re-download anytime",
      "Creator presets, premium fonts, keyword emphasis, caption animation",
      "Content Pack: AI titles, IG caption, hashtags",
      "Limited AI vertical thumbnails: 1 per generation, 1K, 15 credits/mo",
      "Priority support",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    badge: "Studio",
    badgeClass: "text-[#86efac] border-[rgba(134,239,172,0.35)]",
    monthlyPrice: 999,
    yearlyPrice: 833,
    monthlyNote: "45 min/month. 2 thumbnail options per generation, up to 4K, 60 credits/mo.",
    yearlyNote: "Billed ₹9,990/yr. Pay 10 months, get 12 (2 months free).",
    ctaLabel: "Subscribe",
    ctaVariant: "primary",
    features: [
      "45 min of captioning / month",
      "Up to 30 watermark-free exports / day",
      "Unlimited uploads",
      "Saved exports; re-download anytime",
      "Everything in Creator, plus Neon Pop and Gold Luxe",
      "AI thumbnails: 2 options per generation, up to 4K, 60 credits/mo",
      "Scheduling Instagram posts up to 30 days ahead",
      "Priority support",
    ],
  },
];

export function getTierPrice(tier: SubscriptionTier, interval: BillingInterval): number {
  return interval === "Monthly" ? tier.monthlyPrice : tier.yearlyPrice;
}

export function getTierNote(tier: SubscriptionTier, interval: BillingInterval): string {
  return interval === "Monthly" ? tier.monthlyNote : tier.yearlyNote;
}
