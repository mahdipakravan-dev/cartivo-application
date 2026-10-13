"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { CheckCircle2, ImagePlus, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewEditableProps {
  enabled: boolean;
  componentName: string;
  overlaidHeader?: boolean;
  children: ReactNode;
}

export function PreviewEditable({
  enabled,
  componentName,
  overlaidHeader = false,
  children,
}: PreviewEditableProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(componentName);
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const modalTitleId = `preview-editor-${useId().replaceAll(":", "")}`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!enabled) return <>{children}</>;

  const saveDemo = () => {
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 900);
  };

  return (
    <div
      className="relative isolate m-2 rounded-xl border-2 border-dashed border-blue-500"
      data-preview-component={componentName}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "absolute left-3 z-[80] inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
          overlaidHeader ? "top-32" : "top-3",
        )}
        aria-label={`ویرایش ${componentName}`}
      >
        <Pencil className="size-3.5" />
        ویرایش
      </button>

      {children}

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-bold text-blue-600">ویرایش آزمایشی</p>
                <h2
                  id={modalTitleId}
                  className="mt-1 text-lg font-black text-slate-900"
                >
                  {componentName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="بستن پنجره ویرایش"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-slate-700">
                  عنوان بخش
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-slate-700">
                  توضیحات
                </span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="متن نمایشی این بخش را وارد کنید..."
                  className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <button
                type="button"
                className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-xs font-bold text-slate-500 transition hover:border-blue-400 hover:text-blue-600"
              >
                <ImagePlus className="size-5" />
                انتخاب تصویر آزمایشی
              </button>

              <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-6 text-amber-800">
                این نسخه فقط پیش‌نمایش است و تغییرات در سرور ذخیره نمی‌شوند.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 rounded-lg border border-slate-300 px-4 text-xs font-bold text-slate-700 hover:bg-white"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={saveDemo}
                className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="size-4" /> ثبت شد
                  </>
                ) : (
                  <>
                    <Save className="size-4" /> ذخیره آزمایشی
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
