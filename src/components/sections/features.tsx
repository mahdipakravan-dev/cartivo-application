import { RotateCcw, Headphones, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "بازگشت آسان",
    subtitle: "تا ۷ روز",
    icon: RotateCcw,
  },
  {
    title: "پشتیبانی تخصصی",
    subtitle: "۲۴ ساعته",
    icon: Headphones,
  },
  {
    title: "ارسال سریع",
    subtitle: "تکمیل در ۲۴ ساعت",
    icon: Truck,
  },
  {
    title: "ضمانت اصالت کالا",
    subtitle: "۱۰۰٪ اصل",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section className="border-y border-gray-100 bg-white py-8 lg:py-10">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0066ff]/10 lg:h-14 lg:w-14">
                  <Icon className="h-6 w-6 text-[#0066ff]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1B] lg:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#777777] lg:text-sm">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
