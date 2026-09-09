export const spotlightReviews = [
  {
    handle: "@techwithyesh",
    followers: "401K followers",
    image: "/media/reviews/techwithyesh.jpg",
    quote: "It’s working great. Captions are very accurate without spelling mistakes. Good job.",
  },
  {
    handle: "@rishikesav_m",
    followers: "287K followers",
    image: "/media/reviews/rishikesav_m.jpg",
    quote: "Crazy. No spelling mistakes. Damn.",
  },
  {
    handle: "@manjuaitalks",
    followers: "229K followers",
    image: "/media/reviews/manjuaitalks.jpg",
    quote: "Very useful for creators.",
  },
  {
    handle: "@hellotejaa_ai",
    followers: "183K followers",
    image: "/media/reviews/hellotejaa_ai.jpg",
    quote: "Super useful tool for creators like me. The captions are high quality and save a lot of time.",
  },
] as const;

export const compactReviews = [
  {
    name: "Sharath",
    quote: "I tried the Replix Captions yesterday, and honestly, it was really good. The captions were accurate, the spelling was on point, and everything worked smoothly.",
  },
  { name: "@sunny", quote: "Very nice to use without mistakes." },
  { name: "Srikanth", quote: "Very good, very easy to make" },
] as const;

export const thumbnailSamples = Array.from({ length: 9 }, (_, index) => `/media/thumbs/thumb-${index + 1}.webp`);
