import { ShieldCheck, Headphones, RefreshCw, RotateCcw } from "lucide-react";

const slas = [
  {
    icon: Headphones,
    title: "پشتیبانی تخصصی",
    description: "مشاوره فنی رایگان توسط کارشناسان مجرب",
  },
  {
    icon: ShieldCheck,
    title: "اطمینان از اصالت",
    description: "تضمین اصالت تمام قطعات عرضه‌شده",
  },
  {
    icon: RefreshCw,
    title: "بروزرسانی روزانه",
    description: "قیمت و موجودی به‌روز هر روز",
  },
  {
    icon: RotateCcw,
    title: "ضمانت بازگشت وجه",
    description: "بازگشت وجه تا ۷ روز بدون قید و شرط",
  },
];

export function SlaBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {slas.map((sla) => (
        <div
          key={sla.title}
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/15">
            <sla.icon className="h-5 w-5 text-white/70" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{sla.title}</p>
            <p className="mt-0.5 truncate text-[11px] text-white/50">
              {sla.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
