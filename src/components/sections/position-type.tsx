import Link from "next/link";
import {
  Car,
  Settings,
  Wrench,
  Disc,
  Gauge,
  Zap,
  Thermometer,
  Lightbulb,
  Shield,
  Cog,
} from "lucide-react";

const positionTypes = [
  {
    id: "EXTERIOR",
    title: "قطعات بیرونی",
    description: "قطعات بدنه، نمای خارجی و لوازم جانبی بیرونی خودرو",
    href: "/parts?position=EXTERIOR",
    image: "/images/position-type/exterior.png",
    childParts: [
      { name: "سپر", icon: Shield, href: "/parts?position=EXTERIOR" },
      { name: "آینه", icon: Car, href: "/parts?position=EXTERIOR" },
      { name: "چراغ", icon: Lightbulb, href: "/parts?position=EXTERIOR" },
      { name: "درب", icon: Settings, href: "/parts?position=EXTERIOR" },
      { name: "کاپوت", icon: Wrench, href: "/parts?position=EXTERIOR" },
      { name: "گلگیر", icon: Disc, href: "/parts?position=EXTERIOR" },
    ],
  },
  {
    id: "INTERIOR",
    title: "قطعات داخلی",
    description: "قطعات داخل کابین، داشبورد و تجهیزات رفاهی خودرو",
    href: "/parts?position=INTERIOR",
    image: "/images/position-type/interior.png",
    childParts: [
      { name: "داشبورد", icon: Gauge, href: "/parts?position=INTERIOR" },
      { name: "فرمان", icon: Cog, href: "/parts?position=INTERIOR" },
      { name: "صندلی", icon: Thermometer, href: "/parts?position=INTERIOR" },
      { name: "سیستم صوت", icon: Zap, href: "/parts?position=INTERIOR" },
      { name: "کولر", icon: Thermometer, href: "/parts?position=INTERIOR" },
      { name: "تهویه", icon: Settings, href: "/parts?position=INTERIOR" },
    ],
  },
];

export function PositionTypeSection() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-black text-[#1A1A1B] lg:text-2xl">
            دسته‌بندی قطعات
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {positionTypes.map((position) => (
            <div
              key={position.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#14305A] to-[#1a3d6f] min-h-[280px] sm:min-h-[320px]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundImage: `url(${position.image})` }}
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
                {/* Title & Description */}
                <div className="mb-auto">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {position.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                    {position.description}
                  </p>
                  <Link
                    href={position.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    مشاهده دسته‌بندی
                  </Link>
                </div>

                {/* Child Parts */}
                <div className="mt-6 -mx-2 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {position.childParts.map((part) => {
                    const Icon = part.icon;
                    return (
                      <Link
                        key={part.name}
                        href={part.href}
                        className="flex shrink-0 flex-col items-center gap-2"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all group-hover:border-white/30 group-hover:bg-white/20">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-white/70">
                          {part.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
