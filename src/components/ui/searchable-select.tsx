"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "انتخاب کنید",
  searchPlaceholder = "جستجو...",
  disabled = false,
  className,
  emptyMessage = "نتیجه‌ای یافت نشد",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition-all",
          "hover:border-white/30 hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-white/30"
        )}
      >
        <span className={cn("flex-1 truncate text-right", !selectedOption && "text-slate-400")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in-0 zoom-in-95">
          {options.length > 5 && (
            <div className="border-b border-slate-100 p-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-9 pl-8 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none"
                  dir="rtl"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm transition-colors",
                    "hover:bg-slate-50",
                    value === option.value
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-700"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 shrink-0 text-blue-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
