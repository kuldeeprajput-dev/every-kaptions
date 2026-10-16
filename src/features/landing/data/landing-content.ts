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
