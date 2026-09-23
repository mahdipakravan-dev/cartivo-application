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
  variant?: "default" | "showcase";
  leadingIcon?: React.ReactNode;
  ariaLabel?: string;
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
  variant = "default",
  leadingIcon,
  ariaLabel,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", open && "z-50", className)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? placeholder}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-dark shadow-sm transition-all",
          "hover:border-white/30 hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-white/30",
          variant === "showcase" &&
            "border-border/60 bg-card text-base font-semibold text-card-foreground shadow-md hover:border-accent/40 hover:shadow-lg focus-visible:border-ring focus-visible:ring-ring/25 disabled:bg-muted",
          variant === "showcase" && open && "border-accent/50 ring-ring/20",
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {leadingIcon ? (
            <span
              aria-hidden="true"
              className="flex shrink-0 text-primary [&_svg]:size-5"
            >
              {leadingIcon}
            </span>
          ) : null}
          <span
            className={cn(
              "flex-1 truncate text-right",
              !selectedOption && "text-text-secondary",
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-xl shadow-dark/10 animate-in fade-in-0 zoom-in-95",
            variant === "showcase" && "border border-border/60 bg-popover",
          )}
        >
          {options.length > 5 && (
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg  bg-background py-2.5 pr-9 pl-8 text-sm text-dark placeholder:text-text-secondary transition-colors focus:border-accent focus:bg-white focus:outline-none"
                  dir="rtl"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-muted"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-text-secondary">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-sm transition-colors",
                    "hover:bg-background",
                    value === option.value
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-text-muted",
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 shrink-0 text-accent" />
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
