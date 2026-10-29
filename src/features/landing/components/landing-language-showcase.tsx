"use client";

import { useState } from "react";
import { Check, Globe2, Mic, Play, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface LanguageVoiceSample {
  id: string;
  name: string;
  nativeName: string;
  region: string;
  accuracy: string;
  sampleSentence: string;
  scriptPreview: string;
  englishMeaning: string;
  badge: string;
}

const REGIONAL_LANGUAGES: LanguageVoiceSample[] = [
  {
    id: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    region: "Telangana & Andhra Pradesh",
    accuracy: "99.4%",
    sampleSentence: "ఈ వీడియో చూశాక మీ కంటెంట్ లెవెల్ మారిపోతుంది",
    scriptPreview: "Ee video choosaka mee content level maaripothundi",
    englishMeaning: "After watching this video, your content level will transform completely.",
    badge: "Most Popular",
  },
  {
    id: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    region: "Pan-India & North",
    accuracy: "99.2%",
    sampleSentence: "हर क्रिएटर के लिए यह AI टूल गेम चेंजर साबित होगा",
    scriptPreview: "Har creator ke liye yeh AI tool game changer saabit hoga",
    englishMeaning: "For every creator, this AI tool will prove to be an absolute game changer.",
    badge: "Trending",
  },
  {
    id: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    region: "Tamil Nadu & Global Diaspora",
    accuracy: "98.8%",
    sampleSentence: "உங்கள் வீடியோக்களுக்கு துல்லியமான தமிழ் சப்டைட்டில்கள்",
    scriptPreview: "Ungal videokkalukku thulliyamaana Tamil subtitles",
    englishMeaning: "Accurate Tamil subtitles designed specifically for high-retention reels.",
    badge: "High Growth",
  },
  {
    id: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    region: "Karnataka",
    accuracy: "98.6%",
    sampleSentence: "ನಿಮ್ಮ ರೀಲ್ಸ್‌ಗೆ ನಿಖರವಾದ ಕನ್ನಡ ಶೀರ್ಷಿಕೆಗಳನ್ನು ಸೇರಿಸಿ",
    scriptPreview: "Nimma reelsge nikharavaada Kannada captions serisi",
    englishMeaning: "Add perfectly synchronized Kannada captions to your short-form videos.",
    badge: "Creator Favorite",
  },
  {
    id: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    region: "Kerala",
    accuracy: "98.5%",
    sampleSentence: "നിമിഷങ്ങൾക്കുള്ളിൽ നിങ്ങളുടെ വീഡിയോകൾക്ക് കൃത്യമായ സബ്‌ടൈറ്റിലുകൾ",
    scriptPreview: "Nimishangalkkullil ningalude videokalkku krithyamaaya subtitles",
    englishMeaning: "Generate accurate regional subtitles for your videos in just seconds.",
    badge: "Supported",
  },
  {
    id: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    region: "Maharashtra",
    accuracy: "98.7%",
    sampleSentence: "तुमच्या प्रत्येक व्हिडिओसाठी अचूक मराठी कॅप्शन्स मिळवा",
    scriptPreview: "Tumchya pratyek videosathi achuk Marathi captions milva",
    englishMeaning: "Get accurate Marathi captions for every single video you produce.",
    badge: "Supported",
  },
  {
    id: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    region: "West Bengal & Bangladesh",
    accuracy: "98.6%",
    sampleSentence: "আপনার ভিডিওর জন্য নিখুঁত বাংলা সাবটাইটেল তৈরি করুন",
    scriptPreview: "Aapnar videor jonno nikhut Bangla subtitle toiri korun",
    englishMeaning: "Create flawless Bengali subtitles designed for high viewer retention.",
    badge: "Supported",
  },
  {
    id: "en",
    name: "Indian English",
    nativeName: "Hinglish / Tanglish",
    region: "Pan-India Bilingual",
    accuracy: "99.6%",
    sampleSentence: "Transcribe bilingual code-switching with zero manual editing",
    scriptPreview: "Mix English and regional slang seamlessly in every frame",
    englishMeaning: "Naturally handles bilingual creator speech and modern colloquial slang.",
    badge: "Bilingual AI",
  },
];

export function LandingLanguageShowcase() {
  const [activeLangId, setActiveLangId] = useState("te");
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const selectedLang =
    REGIONAL_LANGUAGES.find((lang) => lang.id === activeLangId) || REGIONAL_LANGUAGES[0];

  const handleTogglePlayback = () => {
    setIsPlayingPreview(true);
    setTimeout(() => setIsPlayingPreview(false), 2200);
  };

  return (
    <section aria-labelledby="languages-heading" className="w-full py-16 px-4 max-w-6xl mx-auto font-sans">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1 text-xs font-bold text-amber">
          <Globe2 size={13} aria-hidden="true" />
          <span>Regional Speech AI</span>
        </div>
        <h2 id="languages-heading" className="text-2xl sm:text-3xl font-bold text-cream tracking-tight">
          Trained on the way India actually speaks
        </h2>
        <p className="text-xs sm:text-sm text-dim leading-relaxed">
          From fast colloquial dialects to code-switching Tanglish and Hinglish, EveryKaptions captures regional nuances that generic captioning models miss.
        </p>
      </div>

      {/* Language Selector Pills */}
      <div
        role="tablist"
        aria-label="Supported Indian regional languages"
        className="flex flex-wrap items-center justify-center gap-2 mb-8"
      >
        {REGIONAL_LANGUAGES.map((lang) => {
          const isSelected = lang.id === activeLangId;
          return (
            <button
              key={lang.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveLangId(lang.id)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer",
                isSelected
                  ? "bg-amber text-black shadow-md shadow-amber/20 scale-105"
                  : "border border-hairline bg-surface text-body hover:border-amber/40 hover:text-cream",
              )}
            >
              <span>{lang.name}</span>
              <span className={cn("text-[11px]", isSelected ? "text-black/80 font-black" : "text-dim")}>
                {lang.nativeName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Language Detailed Showcase Card */}
      <div className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-cream">{selectedLang.nativeName}</span>
              <span className="rounded-full bg-amber/15 border border-amber/30 px-2.5 py-0.5 text-[11px] font-bold text-amber">
                {selectedLang.badge}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                <Check size={11} aria-hidden="true" /> {selectedLang.accuracy} Accuracy
              </span>
            </div>

            <p className="text-xs text-body font-medium">Spoken across: {selectedLang.region}</p>

            {/* Script Display Box */}
            <div className="rounded-2xl border border-hairline bg-surface-raised p-5 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dim">Native Script Transcription</span>
                <p className="text-lg sm:text-xl font-bold text-cream leading-relaxed">{selectedLang.sampleSentence}</p>
              </div>

              <div className="border-t border-hairline pt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dim">Phonetic English Transliteration</span>
                <p className="text-xs text-body font-mono">{selectedLang.scriptPreview}</p>
              </div>

              <div className="border-t border-hairline pt-2 text-[11px] text-dim italic">
                &quot;{selectedLang.englishMeaning}&quot;
              </div>
            </div>
          </div>

          {/* Interactive Simulation Player */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-amber/30 bg-gradient-to-b from-[#181712] to-[#0c0b0a] p-6 text-center space-y-5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-body">
                <span className="flex items-center gap-1.5 text-amber">
                  <Mic size={13} aria-hidden="true" /> Live Preview
                </span>
                <span className="font-mono text-dim">00:02.4s</span>
              </div>

              <div className="py-6 px-3 min-h-[90px] flex items-center justify-center">
                <p
                  className={cn(
                    "text-lg font-black leading-snug transition-all duration-200",
                    isPlayingPreview ? "text-amber scale-105 drop-shadow-[0_0_12px_rgba(246,196,83,0.4)]" : "text-cream",
                  )}
                >
                  {selectedLang.sampleSentence}
                </p>
              </div>

              <button
                type="button"
                onClick={handleTogglePlayback}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-amber text-xs font-bold text-black hover:brightness-105 transition cursor-pointer shadow-lg shadow-amber/20"
              >
                {isPlayingPreview ? (
                  <>
                    <Volume2 size={15} className="animate-pulse" /> Playing Sync...
                  </>
                ) : (
                  <>
                    <Play size={14} className="fill-black" /> Test Voice Highlight
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
