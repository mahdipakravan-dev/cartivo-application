import { Search, ArrowLeft } from "lucide-react";

export function VinGuide() {
  return (
    <section id="vin-guide" className="py-12 lg:py-16">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#102a50] to-[#1a3a6a]">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Text */}
            <div className="p-8 text-white lg:p-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium">راهنمای VIN</span>
              </div>
              <h2 className="mb-4 text-2xl font-black leading-tight lg:text-3xl">
                VIN چیست و چه کمکی به شما می‌کند؟
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/80 lg:text-base">
                شماره VIN یا Vehicle Identification Number یک کد ۱۷ رقبی منحصر
                به فرد است که هویت خودروی شما را مشخص می‌کند. با وارد کردن این
                کد، می‌توانید دقیق‌ترین قطعات سازگار با خودرو خود را پیدا کنید
                و از خرید قطعات اشتباه جلوگیری کنید.
              </p>
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#102a50] transition-colors hover:bg-gray-100">
                اطلاعات بیشتر
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            <div className="relative min-h-[300px] md:h-full">
              <img
                src="https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/7634c3849_generated_b7167273.png"
                alt="نمایشگر VIN خودرو"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
