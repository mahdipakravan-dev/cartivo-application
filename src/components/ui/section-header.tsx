import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = "مشاهده همه",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-xl font-bold sm:text-2xl" style={{ color: "#536175" }}>
        {title}
      </h2>

      {href && (
        <Link
          href={href}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <span className="hidden sm:inline">{linkText}</span>
          <span
            className={cn(
              "flex size-7 items-center justify-center",
              "rounded-full border border-slate-200 bg-white",
              "transition-all group-hover:border-slate-300 group-hover:shadow-md",
              "group-hover:shadow-slate-200/50"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:-translate-x-0.5" />
          </span>
        </Link>
      )}
    </div>
  );
}
