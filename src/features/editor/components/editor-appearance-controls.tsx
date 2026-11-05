"use client";

import { Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState, type PointerEvent } from "react";

function useEditorPopover() {
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 240, maxHeight: 300 });
  const place = (desiredHeight: number, width?: number) => {
    const bounds = trigger.current?.getBoundingClientRect();
    if (!bounds) return;
    const panelWidth = Math.min(width ?? bounds.width, window.innerWidth - 16);
    const below = window.innerHeight - bounds.bottom - 16;
    const above = bounds.top - 16;
    const upwards = below < desiredHeight && above > below;
    const maxHeight = Math.max(40, upwards ? above : below);
    setPosition({ left: Math.max(8, Math.min(bounds.left, window.innerWidth - panelWidth - 8)), top: upwards ? Math.max(8, bounds.top - Math.min(desiredHeight, maxHeight) - 6) : bounds.bottom + 6, width: panelWidth, maxHeight });
  };
  const close = () => { menu.current?.hidePopover(); trigger.current?.focus(); };
  return { id, menu, trigger, position, place, close };
}

export function EditorSelect({ label, value, options, onChange }: {
  label: string; value: string; options: readonly { value: string; label: string }[]; onChange: (value: string) => void;
}) {
  const { id, menu, trigger, position, place, close } = useEditorPopover();
  const [open, setOpen] = useState(false);
  return <div className="ce-setting-field">
    <span id={`${id}-label`}>{label}</span>
    <button ref={trigger} type="button" className="ce-setting-select" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} popoverTarget={id} onClick={() => place(options.length * 34 + 10)}>
      <span id={`${id}-value`}>{options.find(option => option.value === value)?.label}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    <div ref={menu} id={id} popover="auto" role="listbox" aria-label={label} className="ce-setting-menu" style={position}
      onToggle={event => {
        setOpen(event.newState === "open");
        if (event.newState === "open") menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
      }}
      onKeyDown={event => {
        const buttons = [...(menu.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let next: number | undefined;
        if (event.key === "ArrowDown") next = (index + 1) % buttons.length;
        if (event.key === "ArrowUp") next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
        if (event.key === "Tab") menu.current?.hidePopover();
      }}>
      {options.map(option => <button type="button" key={option.value} role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); close(); }}><span>{option.label}</span>{option.value === value && <Check size={13} aria-hidden="true" />}</button>)}
    </div>
  </div>;
}

function toHsv(hex: string) {
  const [r, g, b] = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta) h = max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return { h: h * 60, s: max ? delta / max : 0, v: max };
}
function toHex(h: number, s: number, v: number) {
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(channel => Math.round((channel + m) * 255).toString(16).padStart(2, '0')).join('');
}

export function EditorColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const { id, menu, trigger, position, place, close } = useEditorPopover();
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(() => toHsv(value).h);
  const hsv = toHsv(value);
  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const v = 1 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    onChange(toHex(hue, s, v));
  };
  return <div className="ce-setting-field ce-color-field">
    <span>Highlight color</span>
    <button ref={trigger} type="button" className="ce-color-trigger" aria-label={`Highlight color: ${value}`} aria-haspopup="dialog" aria-expanded={open} popoverTarget={id} onClick={() => { place(302, 248); setHue(toHsv(value).h); }}><span style={{ background: value }} /></button>
    <div ref={menu} id={id} popover="auto" role="dialog" aria-label="Highlight color" className="ce-color-panel" style={position} onToggle={event => setOpen(event.newState === "open")}>
      <div className="ce-color-heading"><strong>Highlight color</strong><button type="button" onClick={close} aria-label="Close color picker">×</button></div>
      <div className="ce-color-palette" aria-hidden="true" style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue} 100% 50%)` }}
        onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); pick(event); }}
        onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) pick(event); }}
        onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
        <span className="ce-color-marker" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
      </div>
      <input className="ce-color-hue" type="range" aria-label="Color hue" min="0" max="359" value={hue} onChange={event => { const h = Number(event.target.value); setHue(h); onChange(toHex(h, hsv.s, hsv.v)); }} />
      <label className="ce-color-hex">HEX<input key={value} defaultValue={value.toUpperCase()} aria-label="Highlight color hex value" maxLength={7} spellCheck={false} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} onBlur={event => {
        let hex = event.target.value.trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (/^#[\da-f]{3}$/i.test(hex)) hex = '#' + [...hex.slice(1)].map(char => char + char).join('');
        if (/^#[\da-f]{6}$/i.test(hex)) { setHue(toHsv(hex).h); onChange(hex); }
        else event.target.value = value.toUpperCase();
      }} /></label>
      <div className="ce-color-swatches">{['#c63838', '#f6c453', '#ffffff', '#18181b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map(color => <button type="button" key={color} aria-label={`Use ${color}`} aria-pressed={value.toLowerCase() === color} style={{ background: color }} onClick={() => { setHue(toHsv(color).h); onChange(color); }} />)}</div>
    </div>
  </div>;
}
