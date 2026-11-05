"use client";

import { Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";

const rates = [.5, .75, 1, 1.25, 1.5, 2];

export function PlaybackSpeed({ value, onChange }: { value: number; onChange: (rate: number) => void }) {
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 240 });

  return <div className="ce-speed">
    <span>Speed</span>
    <button ref={trigger} type="button" className="ce-speed-trigger" aria-label={`Playback speed: ${value}×`} aria-haspopup="menu" aria-expanded={open} popoverTarget={id}
      onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPosition({ left: Math.max(8, Math.min(bounds.left, window.innerWidth - 112)), top: bounds.top - 8, maxHeight: Math.max(80, bounds.top - 16) });
      }}>
      {value}×<ChevronDown size={12} aria-hidden="true" />
    </button>
    <div ref={menu} id={id} popover="auto" role="menu" aria-label="Playback speed" className="ce-speed-menu"
      style={{ left: position.left, top: position.top, maxHeight: position.maxHeight }}
      onToggle={event => {
        const expanded = event.newState === "open";
        setOpen(expanded);
        if (expanded) menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
      }}
      onKeyDown={event => {
        const buttons = [...(menu.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let next: number | undefined;
        if (event.key === "ArrowDown") next = (current + 1) % buttons.length;
        if (event.key === "ArrowUp") next = (current - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
        if (event.key === "Tab") menu.current?.hidePopover();
      }}>
      {rates.map(rate => <button key={rate} type="button" role="menuitemradio" aria-checked={value === rate} onClick={() => {
        onChange(rate); menu.current?.hidePopover(); trigger.current?.focus();
      }}><span>{rate}×</span>{value === rate && <Check size={12} aria-hidden="true" />}</button>)}
    </div>
  </div>;
}
