"use client";

import { useEffect, useMemo, useState } from "react";
import { History, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { getPartPriceHistory, type PriceHistoryPoint } from "@/lib/api/pricing";

interface ProductPriceHistoryDialogProps {
  open: boolean;
  partId: number;
  onOpenChange: (open: boolean) => void;
}

type HistoryState =
  | { status: "idle" | "loading"; points: PriceHistoryPoint[] }
  | { status: "success"; points: PriceHistoryPoint[] }
  | { status: "error"; points: []; message: string };

export function ProductPriceHistoryDialog({
  open,
  partId,
  onOpenChange,
}: ProductPriceHistoryDialogProps) {
  const [history, setHistory] = useState<HistoryState>({
    status: "idle",
    points: [],
  });

  useEffect(() => {
    if (!open) return;

    let active = true;
    setHistory({ status: "loading", points: [] });
    getPartPriceHistory(partId)
      .then((page) => {
        if (!active) return;
        setHistory({
          status: "success",
          points: [...(page.content ?? [])].reverse(),
        });
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setHistory({
          status: "error",
          points: [],
          message:
            reason instanceof Error
              ? reason.message
              : "دریافت تاریخچه قیمت انجام نشد.",
        });
      });

    return () => {
      active = false;
    };
  }, [open, partId]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-end justify-center bg-dark/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-history-dialog-title"
        className="relative w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-2xl sm:rounded-[2rem]"
        dir="rtl"
      >
        <div className="h-1.5 bg-gradient-to-l from-[var(--primary)] via-accent to-accent" />
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full text-text-secondary transition hover:bg-border/20 hover:text-text-muted"
          aria-label="بستن نمودار قیمت"
        >
          <X className="size-5" />
        </button>

        <div className="px-6 pb-7 pt-8 sm:px-8 sm:pb-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <History className="size-6" />
          </div>
          <h2
            id="price-history-dialog-title"
            className="mt-4 text-xl font-black text-dark sm:text-2xl"
          >
            میانگین قیمت روزانه
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            روند میانگین قیمت ثبت‌شده فروشندگان برای این محصول را مشاهده کنید.
          </p>

          <div className="mt-6">
            {history.status === "idle" || history.status === "loading" ? (
              <div className="flex min-h-56 items-center justify-center rounded-2xl bg-background">
                <LoaderCircle className="size-7 animate-spin text-[var(--primary)]" />
              </div>
            ) : history.status === "error" ? (
              <div
                role="alert"
                className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 text-center"
              >
                <TriangleAlert className="size-9 text-red-500" />
                <p className="mt-4 text-sm font-bold text-red-800">
                  دریافت تاریخچه قیمت ممکن نشد
                </p>
                <p className="mt-2 text-xs leading-6 text-red-700/70">
                  {history.message}
                </p>
              </div>
            ) : history.points.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center">
                <History className="size-10 text-text-secondary" />
                <p className="mt-4 text-sm font-bold text-text-muted">
                  هنوز تاریخچه قیمتی ثبت نشده است
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  پس از ثبت قیمت روزانه، نمودار در این بخش نمایش داده می‌شود.
                </p>
              </div>
            ) : (
              <PriceHistoryChart points={history.points} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function PriceHistoryChart({ points }: { points: PriceHistoryPoint[] }) {
  const chartPoints = useMemo(
    () =>
      points.filter(
        (
          point,
        ): point is PriceHistoryPoint & {
          priceDate: string;
          averagePriceRial: number;
        } => Boolean(point.priceDate && point.averagePriceRial != null),
      ),
    [points],
  );

  if (chartPoints.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center">
        <History className="size-10 text-text-secondary" />
        <p className="mt-4 text-sm font-bold text-text-muted">
          داده معتبری برای نمودار وجود ندارد
        </p>
      </div>
    );
  }

  const values = chartPoints.map((point) => point.averagePriceRial);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 560;
  const height = 190;
  const padding = 18;
  const coordinates = chartPoints.map((point, index) => ({
    x:
      chartPoints.length === 1
        ? width / 2
        : padding + (index / (chartPoints.length - 1)) * (width - padding * 2),
    y:
      height -
      padding -
      ((point.averagePriceRial - min) / range) * (height - padding * 2),
    point,
  }));

  return (
    <div className="rounded-2xl  bg-background/50 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-text-muted">روند قیمت</p>
        <span className="text-[10px] text-text-secondary">
          {chartPoints.length.toLocaleString("fa-IR")} روز
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 h-52 w-full overflow-visible"
        role="img"
        aria-label="نمودار میانگین روزانه قیمت فروشندگان"
      >
        <path
          d={`M ${padding} ${height - padding} H ${width - padding}`}
          stroke="var(--border)"
          strokeWidth="1"
          fill="none"
        />
        {coordinates.length > 1 && (
          <polyline
            points={coordinates.map(({ x, y }) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {coordinates.map(({ x, y, point }) => (
          <circle
            key={`${point.priceDate}-${point.recordedAt ?? ""}`}
            cx={x}
            cy={y}
            r="5"
            fill="var(--primary)"
          >
            <title>{`${formatDate(point.priceDate)}: ${point.averagePriceRial.toLocaleString("fa-IR")} ریال (${(point.sellerCount ?? 0).toLocaleString("fa-IR")} فروشنده)`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-text-secondary">
        <span>{formatDate(chartPoints.at(-1)?.priceDate)}</span>
        <span>{formatDate(chartPoints[0]?.priceDate)}</span>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "نامشخص";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
}
