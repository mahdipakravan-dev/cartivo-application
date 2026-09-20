import { CarFront, Headphones, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImageTextTileVariant = "primary-background" | "secondary-background";

interface ImageTextTileProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: ImageTextTileVariant;
}

export function ImageTextTile({
  title,
  subtitle,
  icon: Icon,
  variant = "secondary-background",
}: ImageTextTileProps) {
  const primary = variant === "primary-background";

  return (
    <article
      className={cn(
        "relative isolate flex min-h-36 items-center overflow-hidden rounded-2xl px-4 py-5",
        primary
          ? "bg-primary text-primary-foreground shadow-[0_14px_35px_color-mix(in_oklab,var(--primary)_14%,transparent)]"
          : "border border-slate-100 bg-slate-100/80 text-primary",
      )}
    >
      <div className={cn("absolute -right-12 size-36 rounded-full blur-2xl", primary ? "bg-cyan-300/10" : "bg-white/80")} />
      <div
        className={cn(
          "relative z-10 flex size-20 shrink-0 items-center justify-center rounded-2xl",
          primary ? "bg-white/10 text-cyan-100" : "bg-white text-primary shadow-sm",
        )}
      >
        <Icon className="size-10" strokeWidth={1.8} />
      </div>
      <div className="relative z-10 min-w-0 flex-1 pr-2">
        <h3 className="text-sm font-black leading-6 sm:text-base">{title}</h3>
        <p className={cn("mt-1 text-xs leading-5", primary ? "text-white/55" : "text-slate-500")}>
          {subtitle}
        </p>
      </div>
    </article>
  );
}

const tiles: ImageTextTileProps[] = [
  {
    title: "ارسال سریع",
    subtitle: "تحویل مطمئن سفارش",
    icon: Truck,
    variant: "primary-background",
  },
  {
    title: "ضمانت اصالت",
    subtitle: "قطعات بررسی‌شده",
    icon: ShieldCheck,
    variant: "secondary-background",
  },
  {
    title: "انتخاب دقیق",
    subtitle: "سازگار با خودروی شما",
    icon: CarFront,
    variant: "primary-background",
  },
  {
    title: "پشتیبانی تخصصی",
    subtitle: "همراه شما در خرید",
    icon: Headphones,
    variant: "secondary-background",
  },
];

export function Features() {
  return (
    <section id="services" className="bg-white py-14 sm:py-16" aria-label="خدمات کارتیوو">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <ImageTextTile key={tile.title} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
