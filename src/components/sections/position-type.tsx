import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Armchair, CarFront, Package } from "lucide-react";
import { searchParts } from "@/lib/api/parts";
import type { PartFrontofficeResponse } from "@/lib/api/types";

interface PositionCardProps {
  title: string;
  description: string;
  href: string;
  parts: PartFrontofficeResponse[];
  kind: "INTERIOR" | "EXTERIOR";
}

function PositionCard({ title, description, href, parts, kind }: PositionCardProps) {
  const Icon = kind === "INTERIOR" ? Armchair : CarFront;

  return (
    <Link
      href={href}
      className="group relative isolate min-h-[340px] overflow-hidden rounded-[2rem] bg-[#14305A] p-6 shadow-[0_18px_50px_rgb(15_48_90/0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgb(15_48_90/0.16)] sm:p-8"
    >
      <div className="absolute -left-20 -top-20 size-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative z-10 max-w-[58%]">
        <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-cyan-200">
          <Icon className="size-5" />
        </span>
        <h3 className="mt-5 text-2xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-cyan-200">
          مشاهده قطعات
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>

      <div className="absolute -bottom-5 -left-5 grid w-[47%] rotate-[-5deg] grid-cols-2 gap-2" aria-hidden="true">
        {(parts.length > 0 ? parts.slice(0, 4) : [null, null, null, null]).map((part, index) => {
          const image = part?.imageUrls?.find(Boolean);
          return (
            <div key={part?.id ?? index} className="relative aspect-square overflow-hidden rounded-2xl border border-white/60 bg-white shadow-xl">
              {image ? (
                <Image src={image} alt="" fill sizes="180px" className="object-contain p-3" />
              ) : (
                <Package className="absolute inset-0 m-auto size-7 text-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    </Link>
  );
}

export async function PositionTypeSection() {
  const [interior, exterior] = await Promise.all([
    searchParts({ positionType: "INTERIOR", size: 4, sortBy: "createdAt", sortDir: "DESC" }),
    searchParts({ positionType: "EXTERIOR", size: 4, sortBy: "createdAt", sortDir: "DESC" }),
  ]);

  return (
    <section className="bg-[#f8fafc] py-14 sm:py-16" aria-labelledby="position-title">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold text-cyan-700">انتخاب بر اساس موقعیت</p>
          <h2 id="position-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            قطعات داخلی و بیرونی خودرو
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <PositionCard
            title="قطعات داخلی"
            description="قطعات کابین، داشبورد و تجهیزات داخلی خودرو را یک‌جا ببینید."
            href="/parts?position=INTERIOR"
            parts={interior.items}
            kind="INTERIOR"
          />
          <PositionCard
            title="قطعات بیرونی"
            description="قطعات بدنه، چراغ‌ها و تجهیزات نمای بیرونی خودرو را پیدا کنید."
            href="/parts?position=EXTERIOR"
            parts={exterior.items}
            kind="EXTERIOR"
          />
        </div>
      </div>
    </section>
  );
}
