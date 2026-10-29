export interface SpotlightReview {
  handle: string;
  followers: string;
  quote: string;
  verified?: boolean;
  role?: string;
}

export interface CompactReview {
  name: string;
  quote: string;
}

export interface RegionalLanguageFeature {
  code: string;
  name: string;
  nativeScript: string;
  speakers: string;
  accuracyRate: string;
  description: string;
  highlightDialect: string;
  exampleTransliteration: string;
}

export interface RegionalCreatorTestimonial {
  creator: string;
  channel: string;
  language: string;
  subscriberCount: string;
  feedback: string;
  platform: "Instagram" | "YouTube";
}

export const spotlightReviews: SpotlightReview[] = [
  {
    handle: "@techwithyesh",
    followers: "401K followers",
    quote: "It's working great. Captions are very accurate without spelling mistakes. Good job.",
    verified: true,
  },
  {
    handle: "@rishikesav_m",
    followers: "287K followers",
    quote: "Crazy. No spelling mistakes. Damn.",
    verified: true,
  },
  {
    handle: "@manjuaitalks",
    followers: "229K followers",
    quote: "Very useful for creators.",
    verified: true,
  },
  {
    handle: "@hellotejaa_ai",
    followers: "183K followers",
    quote:
      "Super useful tool for creators like me. The captions are high quality and save a lot of time. One thing I'd love to see is more templates and caption styles for different types of content.",
    verified: true,
  },
];

export const compactReviews: CompactReview[] = [
  {
    name: "Sharath",
    quote:
      "I tried EveryKaptions yesterday, and honestly, it was really good. The captions were accurate, the spelling was on point, and everything worked smoothly. I loved the overall experience.",
  },
  {
    name: "@sunny",
    quote: "Very nice to use without mistakes.",
  },
  {
    name: "Srikanth",
    quote: "Very good, very easy to make",
  },
];

export const regionalLanguageFeatures: RegionalLanguageFeature[] = [
  {
    code: "te",
    name: "Telugu",
    nativeScript: "తెలుగు",
    speakers: "95M+ Speakers",
    accuracyRate: "99.4%",
    description: "Full vocabulary support for both classical Telugu and modern conversational slang.",
    highlightDialect: "Telangana & Coastal Andhra",
    exampleTransliteration: "Chala accurate ga unnai captions",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeScript: "हिन्दी",
    speakers: "600M+ Speakers",
    accuracyRate: "99.2%",
    description: "Robust recognition across colloquial dialects and conversational speed runs.",
    highlightDialect: "Standard & Urban Colloquial",
    exampleTransliteration: "Bina kisi galti ke subtitles ban gaye",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeScript: "தமிழ்",
    speakers: "85M+ Speakers",
    accuracyRate: "98.8%",
    description: "Tuned for rapid social content and Chennai/Madurai speech cadences.",
    highlightDialect: "Madras & Central Tamil",
    exampleTransliteration: "Super fast ah generate aagiduchu",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeScript: "ಕನ್ನಡ",
    speakers: "60M+ Speakers",
    accuracyRate: "98.6%",
    description: "Deep support for Sandalwood creator styles and colloquial Bengaluru slang.",
    highlightDialect: "Old Mysore & Coastal Kannada",
    exampleTransliteration: "Reels ge tumba helpful aagide",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeScript: "മലയാളം",
    speakers: "38M+ Speakers",
    accuracyRate: "98.5%",
    description: "Accurate transcriptions for quick colloquial Malayalam reels and reviews.",
    highlightDialect: "Central Travancore & Malabar",
    exampleTransliteration: "Nalla quality captions kittunnu",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeScript: "मराठी",
    speakers: "90M+ Speakers",
    accuracyRate: "98.7%",
    description: "Captures conversational inflections and regional Marathi idioms seamlessly.",
    highlightDialect: "Deshi & Puneri Marathi",
    exampleTransliteration: "Far sundar ani fast subtitles",
  },
];

export const regionalCreatorTestimonials: RegionalCreatorTestimonial[] = [
  {
    creator: "Karthik Varma",
    channel: "@telugutechreviews",
    language: "Telugu",
    subscriberCount: "340K",
    feedback: "EveryKaptions handles fast Telugu tech terminology without turning words into gibberish.",
    platform: "YouTube",
  },
  {
    creator: "Neha Sharma",
    channel: "@nehastories_hindi",
    language: "Hindi",
    subscriberCount: "520K",
    feedback: "Storytelling reels need exact emotional pacing. The karaoke timing is spot-on.",
    platform: "Instagram",
  },
  {
    creator: "Siddharth R",
    channel: "@chennaifoodie",
    language: "Tamil",
    subscriberCount: "195K",
    feedback: "Tanglish code-switching works out of the box. Saves me 45 minutes every evening.",
    platform: "Instagram",
  },
  {
    creator: "Ananya Gowda",
    channel: "@bengaluru_bites",
    language: "Kannada",
    subscriberCount: "165K",
    feedback: "The Kannada script rendering is flawless. No missing conjunct consonants.",
    platform: "Instagram",
  },
  {
    creator: "Aditya Patil",
    channel: "@marathivlogger",
    language: "Marathi",
    subscriberCount: "280K",
    feedback: "Best captioning tool for Marathi video creators. Completely transformed our workflow.",
    platform: "YouTube",
  },
];
