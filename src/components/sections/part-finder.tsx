"use client";

import {
  Camera,
  CarFront,
  CheckCircle2,
  Factory,
  FolderTree,
  Hash,
  LoaderCircle,
  PackageSearch,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { fetchCarsByBrand } from "@/lib/api/brands";
import { globalSearch, type GlobalSearchResponse } from "@/lib/api/search";
import type {
  BrandFrontofficeResponse,
  CarFrontofficeDetailResponse,
} from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FinderTab = "vehicle" | "vin" | "image";
type CameraPhase = "preview" | "searching" | "results";

const STATIC_IMAGE_QUERY = "درب ۲۰۶";
const EMPTY_IMAGE_RESULTS: GlobalSearchResponse = {
  brands: [],
  cars: [],
  partCategories: [],
  parts: [],
};

interface PartFinderProps {
  brands?: BrandFrontofficeResponse[];
  className?: string;
  searchButtonClassName?: string;
  onVinSearch?: (vin: string) => void;
}

const tabs = [
  { id: "vehicle", label: "خودرو", icon: CarFront },
  { id: "vin", label: "VIN", icon: Hash },
  { id: "image", label: "تصویری", icon: Camera },
] satisfies Array<{ id: FinderTab; label: string; icon: typeof CarFront }>;

export function PartFinder({
  brands = [],
  className,
  searchButtonClassName,
  onVinSearch,
}: PartFinderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FinderTab>("vehicle");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [cars, setCars] = useState<CarFrontofficeDetailResponse[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [vin, setVin] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPhase, setCameraPhase] = useState<CameraPhase>("preview");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imageResults, setImageResults] = useState<GlobalSearchResponse>(EMPTY_IMAGE_RESULTS);
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [imageSearchError, setImageSearchError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timersRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selectedBrandSlug) {
      setCars([]);
      setSelectedCarId("");
      return;
    }

    let cancelled = false;
    setLoadingCars(true);
    setSelectedCarId("");

    fetchCarsByBrand(selectedBrandSlug)
      .then((response) => {
        if (!cancelled) setCars(response);
      })
      .finally(() => {
        if (!cancelled) setLoadingCars(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBrandSlug]);

  const brandOptions = useMemo(
    () =>
      brands
        .filter((brand) => brand.slug)
        .map((brand) => ({
          value: brand.slug ?? "",
          label: brand.persianName ?? "",
        })),
    [brands]
  );

  const carOptions = useMemo(
    () =>
      cars
        .filter((car) => car.id != null)
        .map((car) => ({
          value: String(car.id),
          label: `${car.model ?? ""}${car.trimLevel ? ` ${car.trimLevel}` : ""}`,
        })),
    [cars]
  );

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }, []);

  const playAudio = useCallback(
    (src: string) => {
      stopAudio();
      const audio = new Audio(src);
      audioRef.current = audio;
      void audio.play().catch(() => undefined);
    },
    [stopAudio]
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const cleanupCamera = useCallback(() => {
    clearTimers();
    stopAudio();
    stopCamera();
  }, [clearTimers, stopAudio, stopCamera]);

  const loadStaticImageResults = useCallback(async () => {
    setImageSearchLoading(true);
    setImageSearchError(null);

    try {
      const response = await globalSearch(STATIC_IMAGE_QUERY);
      setImageResults({
        brands: response.brands ?? [],
        cars: response.cars ?? [],
        partCategories: response.partCategories ?? [],
        parts: response.parts ?? [],
      });
    } catch (error) {
      setImageResults(EMPTY_IMAGE_RESULTS);
      setImageSearchError(
        error instanceof Error ? error.message : "جست‌وجوی تصویری انجام نشد."
      );
    } finally {
      setImageSearchLoading(false);
    }
  }, []);

  const beginMockDetection = useCallback(() => {
    clearTimers();
    setCameraPhase("preview");
    void loadStaticImageResults();

    const searchingTimer = window.setTimeout(() => {
      setCameraPhase("searching");
      playAudio("/musics/searching.mp3");
    }, 10_000);

    const resultsTimer = window.setTimeout(() => {
      setCameraPhase("results");
      stopAudio();
      stopCamera();
    }, 20_000);

    timersRef.current = [searchingTimer, resultsTimer];
  }, [clearTimers, loadStaticImageResults, playAudio, stopAudio, stopCamera]);

  const startCamera = useCallback(async () => {
    cleanupCamera();
    setCameraError(null);
    setCameraPhase("preview");
    beginMockDetection();

    if (!navigator.mediaDevices?.getUserMedia) {
      clearTimers();
      setCameraError("مرورگر شما از دسترسی به دوربین پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      clearTimers();
      setCameraError(
        "دسترسی به دوربین ممکن نشد. مجوز دوربین را فعال و دوباره تلاش کنید."
      );
    }
  }, [beginMockDetection, cleanupCamera, clearTimers]);

  const openCamera = () => {
    playAudio("/musics/start-video.mp3");
    setActiveTab("image");
    setCameraOpen(true);
  };

  const closeCamera = useCallback(() => {
    cleanupCamera();
    setCameraOpen(false);
    setCameraPhase("preview");
    setCameraError(null);
    setImageSearchError(null);
    setActiveTab("vehicle");
  }, [cleanupCamera]);

  const imageResultCount =
    (imageResults.brands?.length ?? 0) +
    (imageResults.cars?.length ?? 0) +
    (imageResults.parts?.length ?? 0) +
    (imageResults.partCategories?.length ?? 0);
  const imageBrands = imageResults.brands ?? [];
  const imageCars = imageResults.cars ?? [];
  const imageParts = imageResults.parts ?? [];
  const imageCategories = imageResults.partCategories ?? [];

  useEffect(() => {
    if (!cameraOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    void startCamera();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCamera();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      cleanupCamera();
    };
  }, [cameraOpen, cleanupCamera, closeCamera, startCamera]);

  useEffect(() => cleanupCamera, [cleanupCamera]);

  const submitVinSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedVin = vin.trim().toUpperCase();
    if (normalizedVin.length === 17) onVinSearch?.(normalizedVin);
  };

  const cameraOverlay = cameraOpen ? (
    <div
      className="fixed inset-0 z-[9999] bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجوی تصویری قطعه"
      dir="rtl"
    >
      {cameraPhase !== "results" ? (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(0,0,0,0.12)_52%,rgba(0,0,0,0.82)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/90 via-black/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 to-transparent" />

          <button
            type="button"
            onClick={closeCamera}
            aria-label="بستن دوربین"
            className="absolute left-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition hover:bg-black/65 sm:left-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-4 top-20 z-20 flex justify-center sm:inset-x-12 sm:top-10">
            <div className="inline-flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-center text-sm leading-7 shadow-2xl backdrop-blur-xl sm:px-6 sm:text-base">
              {cameraPhase === "searching" ? (
                <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-cyan-300" />
              ) : (
                <Sparkles className="h-5 w-5 shrink-0 text-cyan-300" />
              )}
              <span>
                {cameraPhase === "searching"
                  ? "در حال جست و جو قطعه مورد نظر هستیم"
                  : "برای یافتن قطعه مورد نظر دوربین را به سمت قطعه مورد نظر بگیرید"}
              </span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-6 pb-8 pt-28 sm:px-12 sm:pb-0 sm:pt-24">
            <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/55 shadow-[0_0_0_9999px_rgba(0,0,0,0.18),0_0_70px_rgba(34,211,238,0.22)]">
              <span className="absolute left-0 top-0 h-14 w-14 rounded-tl-[31px] border-l-4 border-t-4 border-cyan-300" />
              <span className="absolute right-0 top-0 h-14 w-14 rounded-tr-[31px] border-r-4 border-t-4 border-cyan-300" />
              <span className="absolute bottom-0 left-0 h-14 w-14 rounded-bl-[31px] border-b-4 border-l-4 border-cyan-300" />
              <span className="absolute bottom-0 right-0 h-14 w-14 rounded-br-[31px] border-b-4 border-r-4 border-cyan-300" />

              {cameraPhase === "searching" && (
                <div className="scanner-line absolute inset-x-5 top-5 h-0.5 bg-cyan-300 shadow-[0_0_22px_5px_rgba(34,211,238,0.95)]" />
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center px-4">
            <div className="rounded-full border border-white/15 bg-black/45 px-5 py-2.5 text-xs text-white/70 backdrop-blur-xl sm:text-sm">
              {cameraPhase === "searching"
                ? "تحلیل تصویر و تطبیق با کاتالوگ قطعات"
                : "قطعه را داخل کادر نگه دارید"}
            </div>
          </div>

          {cameraError && (
            <div className="absolute inset-0 z-40 grid place-items-center bg-slate-950/95 p-6 backdrop-blur-xl">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 text-center shadow-2xl">
                <Camera className="mx-auto h-10 w-10 text-rose-300" />
                <p className="mt-4 text-sm leading-7 text-white/70">{cameraError}</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button type="button" onClick={() => void startCamera()}>
                    <RefreshCw className="h-4 w-4" />
                    تلاش دوباره
                  </Button>
                  <Button type="button" variant="outline" onClick={closeCamera}>
                    بستن
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[100dvh] overflow-y-auto bg-slate-950 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  قطعات مشابه پیدا شدند
                </div>
                <p className="mt-2 text-sm text-white/45">
                  نتیجه جست‌وجوی ثابت برای «{STATIC_IMAGE_QUERY}»
                </p>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold text-cyan-200/80">عبارت جست‌وجو</p>
                  <p className="mt-1 text-base font-semibold text-white">{STATIC_IMAGE_QUERY}</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {imageResultCount.toLocaleString("fa-IR")} نتیجه پیدا شد
                </div>
              </div>

              {imageSearchLoading ? (
                <div className="flex min-h-56 items-center justify-center">
                  <LoaderCircle className="h-7 w-7 animate-spin text-cyan-300" />
                </div>
              ) : imageSearchError ? (
                <div className="py-12 text-center text-sm text-rose-200">{imageSearchError}</div>
              ) : imageResultCount === 0 ? (
                <div className="py-12 text-center text-sm text-white/55">
                  نتیجه‌ای برای این جست‌وجوی ثابت پیدا نشد.
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {imageBrands.length > 0 && (
                    <ImageResultSection
                      icon={Factory}
                      title="برندهای پیدا شده"
                      items={imageBrands.map((brand, index) => ({
                        key: String(brand.id ?? index),
                        title: brand.persianName || brand.englishName || "برند خودرو",
                        subtitle: brand.englishName || "مشاهده برند",
                        onClick: () => router.push(ROUTES.brandDetail(brand.slug ?? "")),
                        ...(index === 0 ? { badge: "مرتبط" } : {}),
                      }))}
                    />
                  )}

                  {imageCars.length > 0 && (
                    <ImageResultSection
                      icon={CarFront}
                      title="خودروهای پیدا شده"
                      items={imageCars.map((car, index) => ({
                        key: String(car.id ?? index),
                        title: [car.brand, car.model].filter(Boolean).join(" ") || "خودرو",
                        subtitle: car.trimLevel || "مشاهده قطعات سازگار",
                        onClick: () =>
                          router.push(
                            car.id == null ? ROUTES.parts : `${ROUTES.parts}?carIds=${car.id}`
                          ),
                        ...(index === 0 ? { badge: "پیشنهادی" } : {}),
                      }))}
                    />
                  )}

                  {imageParts.length > 0 && (
                    <ImageResultSection
                      icon={PackageSearch}
                      title="قطعات پیدا شده"
                      items={imageParts.map((part, index) => ({
                        key: String(part.id ?? index),
                        title: part.name || "قطعه خودرو",
                        subtitle:
                          [part.partBrandName, part.parentPartName]
                            .filter(Boolean)
                            .join(" • ") || part.description || "مشاهده جزئیات قطعه",
                        onClick: () =>
                          router.push(
                            part.id == null ? ROUTES.parts : ROUTES.partDetail(String(part.id))
                          ),
                        ...(index === 0 ? { badge: "بهترین نتیجه" } : {}),
                      }))}
                    />
                  )}

                  {imageCategories.length > 0 && (
                    <ImageResultSection
                      icon={FolderTree}
                      title="دسته‌بندی‌های پیدا شده"
                      items={imageCategories.map((category, index) => ({
                        key: String(category.id ?? index),
                        title: category.name || "دسته‌بندی قطعات",
                        subtitle:
                          category.position === "INTERIOR"
                            ? "قطعات داخلی"
                            : category.position === "EXTERIOR"
                              ? "قطعات بیرونی"
                              : "مشاهده محصولات",
                        onClick: () =>
                          router.push(
                            category.id == null
                              ? ROUTES.parts
                              : `${ROUTES.parts}?parentPartIds=${category.id}`
                          ),
                        ...(index === 0 ? { badge: "دسته مرتبط" } : {}),
                      }))}
                    />
                  )}
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={() => {
                playAudio("/musics/start-video.mp3");
                void startCamera();
              }}
              className="mt-6 h-12 w-full rounded-xl"
            >
              <RefreshCw className="h-4 w-4" />
              اسکن مجدد
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scanner-line {
          animation: scannerMove 1.8s ease-in-out infinite alternate;
        }
        @keyframes scannerMove {
          from { top: 1.25rem; }
          to { top: calc(100% - 1.25rem); }
        }
      `}</style>
    </div>
  ) : null;

  return (
    <div className={cn("w-full", className)} dir="rtl">
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/15 bg-black/15 p-1" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (id === "image") openCamera();
                else setActiveTab(id);
              }}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition",
                isActive
                  ? "bg-white text-[#14305A] shadow-lg"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {activeTab === "vehicle" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <SearchableSelect
                options={brandOptions}
                value={selectedBrandSlug}
                onValueChange={setSelectedBrandSlug}
                placeholder="انتخاب برند"
                searchPlaceholder="جستجوی برند..."
                className="flex-1"
              />
              <SearchableSelect
                options={carOptions}
                value={selectedCarId}
                onValueChange={setSelectedCarId}
                placeholder="انتخاب خودرو"
                searchPlaceholder="جستجوی خودرو..."
                disabled={!selectedBrandSlug || loadingCars}
                emptyMessage={loadingCars ? "در حال بارگذاری..." : "خودرویی یافت نشد"}
                className="flex-1"
              />
            </div>
            <Button
              size="lg"
              disabled={!selectedBrandSlug || !selectedCarId}
              onClick={() => router.push(ROUTES.partsCar(selectedBrandSlug, selectedCarId))}
              className={cn(
                "h-12 w-full rounded-xl text-sm font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
                searchButtonClassName
              )}
            >
              <Search className="h-4 w-4" />
              جستجو
            </Button>
          </div>
        )}

        {activeTab === "vin" && (
          <form onSubmit={submitVinSearch} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              کد ۱۷ کاراکتری VIN را وارد کنید
            </div>
            <div className="relative">
              <input
                value={vin}
                onChange={(event) =>
                  setVin(
                    event.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .slice(0, 17)
                      .toUpperCase()
                  )
                }
                dir="ltr"
                maxLength={17}
                placeholder="VF3XXXXXXXXXXXXXX"
                className="h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 font-mono text-sm tracking-[0.12em] text-white outline-none placeholder:text-white/30 focus:border-white/35"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-white/40">
                {vin.length}/17
              </span>
            </div>
            <Button type="submit" size="lg" disabled={vin.length !== 17} className="h-12 rounded-xl bg-white text-[#14305A] hover:bg-white/90">
              <Search className="h-4 w-4" />
              استعلام VIN
            </Button>
            <p className="text-xs leading-6 text-white/45">
              این بخش فعلاً نمایشی است و بعداً به API استعلام VIN متصل می‌شود.
            </p>
          </form>
        )}
      </div>

      {mounted && cameraOverlay ? createPortal(cameraOverlay, document.body) : null}
    </div>
  );
}

function ImageResultSection({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Search;
  title: string;
  items: Array<{
    key: string;
    title: string;
    subtitle: string;
    onClick: () => void;
    badge?: string;
  }>;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className="group flex w-full items-center gap-4  p-4 text-right transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.08]"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center  bg-gradient-to-br from-slate-800 to-slate-950">
              <Icon className="h-6 w-6 text-white/45" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold sm:text-base">{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] text-emerald-200">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-white/40 sm:text-sm">{item.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
