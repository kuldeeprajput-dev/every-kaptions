"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

interface CustomSelectProps {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  errorId?: string;
}

export function CustomSelect({ options, value, onChange, label, placeholder = "Choose an option", id, name, required, errorId }: CustomSelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-options`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = options.findIndex(option => option.value === value);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open && keyboardActive) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, keyboardActive, listId, open]);

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setKeyboardActive(true);
      if (!open) { setActive(selected >= 0 ? selected : event.key === "ArrowDown" ? 0 : options.length - 1); setOpen(true); }
      else setActive(previous => (previous + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); setKeyboardActive(true); setActive(event.key === "Home" ? 0 : options.length - 1); setOpen(true);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else { setActive(Math.max(0, selected)); setKeyboardActive(true); setOpen(true); }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const match = options.findIndex(option => option.label.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0) { event.preventDefault(); setActive(match); setKeyboardActive(true); setOpen(true); }
    }
  };

  return (
    <div ref={root} className="relative w-full" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={trigger}
        id={triggerId}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={Boolean(errorId)}
        aria-describedby={errorId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onKeyDown={onKeyDown}
        onClick={() => { setActive(Math.max(0, selected)); setKeyboardActive(false); setOpen(!open); }}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#dedee5] bg-[#fafafa] px-3 py-2.5 text-left text-[13px] font-normal text-[#52525b] outline-none focus-visible:border-[#a1a1aa] focus-visible:ring-2 focus-visible:ring-[#ededf1]"
      >
        <span className="min-w-0 truncate">{selected >= 0 ? options[selected].label : placeholder}</span>
        <ChevronDown size={15} aria-hidden="true" className={`shrink-0 text-[#8b8b95] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div id={listId} role="listbox" aria-label={label} className="absolute inset-x-0 top-[calc(100%+6px)] z-40 max-h-64 overflow-y-auto rounded-xl border border-[#e4e4e7] bg-white p-1.5 shadow-[0_12px_28px_-12px_rgba(24,24,27,0.2)]">
        {options.map((option, index) => <button key={option.value} id={`${listId}-${index}`} type="button" role="option" aria-selected={option.value === value} tabIndex={-1} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)} className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-left text-[12px] font-normal text-[#52525b] ${keyboardActive && active === index ? "ring-1 ring-inset ring-[#dedee5]" : ""}`}><span>{option.label}</span>{option.value === value && <Check size={13} aria-hidden="true" className="shrink-0 text-[#71717a]" />}</button>)}
      </div>}
    </div>
  );
}
