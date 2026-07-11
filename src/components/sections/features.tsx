import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImageTextTileVariant = "primary-background" | "secondary-background";

interface ImageTextTileProps {
  title: string;
  subtitle: string;
  image: string;
  variant?: ImageTextTileVariant;
}

export function ImageTextTile({
  title,
  subtitle,
  image,
  variant = "secondary-background",
}: ImageTextTileProps) {
  const primary = variant === "primary-background";

  return (
    <article
      className={cn(
        "relative isolate flex min-h-36 items-center overflow-hidden rounded-2xl px-4 py-5",
        primary
          ? "bg-[#14305A] text-white shadow-[0_14px_35px_rgb(15_48_90/0.14)]"
          : "border border-slate-100 bg-slate-100/80 text-[#14305A]",
      )}
    >
      <div className={cn("absolute -right-12 size-36 rounded-full blur-2xl", primary ? "bg-cyan-300/10" : "bg-white/80")} />
      <div className="relative h-24 w-[44%] shrink-0">
        <Image src={image} alt="" fill sizes="180px" className="object-contain drop-shadow-lg" />
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
    image: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/54ec375fd_generated_d9e27dd1.png",
    variant: "primary-background",
  },
  {
    title: "ضمانت اصالت",
    subtitle: "قطعات بررسی‌شده",
    image: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/10877c212_generated_4caa0b9b.png",
    variant: "secondary-background",
  },
  {
    title: "انتخاب دقیق",
    subtitle: "سازگار با خودروی شما",
    image: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/a79b85e09_generated_25901b0a.png",
    variant: "primary-background",
  },
  {
    title: "پشتیبانی تخصصی",
    subtitle: "همراه شما در خرید",
    image: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/969d3daa3_generated_76dda287.png",
    variant: "secondary-background",
  },
];

export function Features() {
  return (
    <section className="bg-white py-14 sm:py-16" aria-label="خدمات کارتیوو">
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
