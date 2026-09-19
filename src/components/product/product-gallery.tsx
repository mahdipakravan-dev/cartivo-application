"use client";

import { useState } from "react";
import { History, ImageIcon, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductPriceHistoryDialog } from "./product-price-history-dialog";

export function ProductGallery({ images, name, partId }: { images: string[]; name: string; partId?: number }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const activeImage = images[selected];

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
        {activeImage && !failed ? (
          // The API controls image hosts, so a native image keeps future CDN URLs compatible.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt={`${name} - تصویر ${selected + 1}`} className="h-full w-full object-contain p-8 mix-blend-multiply" onError={() => setFailed(true)} />
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <Package className="size-28" strokeWidth={1} />
            <span className="mt-4 text-sm font-medium">تصویر محصول به‌زودی</span>
          </div>
        )}
        <span className="absolute right-5 top-5 rounded-full border border-white bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm backdrop-blur">کالای اصل</span>
        {partId != null && (
          <button
            type="button"
            onClick={() => setPriceHistoryOpen(true)}
            className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1.5 text-xs font-bold text-[#14305A] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <History className="size-4 text-cyan-700" />
            نمایش میانگین قیمت
          </button>
        )}
      </div>

      {partId != null && (
        <ProductPriceHistoryDialog
          open={priceHistoryOpen}
          partId={partId}
          onOpenChange={setPriceHistoryOpen}
        />
      )}

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button key={`${image}-${index}`} type="button" onClick={() => { setSelected(index); setFailed(false); }} aria-label={`نمایش تصویر ${index + 1}`} className={cn("flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white transition", selected === index ? "border-[#14305A] ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      {images.length === 0 && <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><ImageIcon className="size-4" /> تصاویر بیشتری برای این محصول ثبت نشده است.</div>}
    </div>
  );
}
