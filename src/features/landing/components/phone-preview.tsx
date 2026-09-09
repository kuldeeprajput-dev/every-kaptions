import { Play } from "lucide-react";

export function PhonePreview() {
  return (
    <div className="mx-auto w-[190px] rotate-[6deg] rounded-[32px] border border-white/15 bg-[#090909] p-2 shadow-[0_28px_60px_rgba(0,0,0,.55)]">
      <div className="overflow-hidden rounded-[25px] border border-white/10 bg-gradient-to-b from-[#2a2113] to-[#0d0c0b]">
        <div className="flex items-center justify-between px-4 py-3 text-[8px] font-semibold text-cream">
          <span>New Reel</span><span>Share</span>
        </div>
        <div className="grid aspect-[9/13] place-items-center bg-[radial-gradient(circle_at_50%_30%,rgba(246,196,83,.15),transparent_55%)]">
          <div className="text-center">
            <p className="mb-5 text-[9px] tracking-[.18em] text-dim">CAPTION READY</p>
            <Play className="mx-auto fill-amber text-amber" size={28} />
          </div>
        </div>
        <div className="px-4 py-4">
          <p className="text-[8px] text-copy">Your Reel is ready to post.</p>
          <div className="mt-3 flex gap-2 text-[7px] font-bold">
            <span className="rounded-full bg-amber px-3 py-1.5 text-canvas">Post now</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5 text-cream">Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
}
