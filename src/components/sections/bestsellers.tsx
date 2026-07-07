import { Heart, ShoppingCart } from "lucide-react";
import { searchParts } from "@/lib/api/parts";
import { SectionHeader } from "@/components/ui/section-header";

interface BestsellerPart {
  name: string;
  carModel: string;
  price: number;
  image: string;
  badge?: string;
}

const fallbackParts: BestsellerPart[] = [
  {
    name: "لنت ترمز جلو",
    carModel: "پژو ۲۰۶ تیپ ۲",
    price: 385000,
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/10877c212_generated_4caa0b9b.png",
    badge: "پرفروش",
  },
  {
    name: "فیلتر روغن موتور",
    carModel: "تویوتا کرولا",
    price: 185000,
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/a79b85e09_generated_25901b0a.png",
  },
  {
    name: "شمع موتور پلاتینیوم",
    carModel: "هیوندای النترا",
    price: 220000,
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/969d3daa3_generated_76dda287.png",
    badge: "جدید",
  },
  {
    name: "فیلتر هوای موتور",
    carModel: "کیا سراتو",
    price: 95000,
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/fcf6f9bcb_generated_e8058a79.png",
  },
  {
    name: "چراغ جلو LED",
    carModel: "چری تیگو ۵",
    price: 1250000,
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/54ec375fd_generated_d9e27dd1.png",
    badge: "ویژه",
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function ProductCard({ part }: { part: BestsellerPart }) {
  return (
    <div className="group w-60 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all hover:border-[#0066ff]/20 hover:shadow-xl lg:w-64">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-50 lg:h-48">
        <img
          src={part.image}
          alt={part.name}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {part.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[#0066ff] px-2.5 py-1 text-[10px] font-bold text-white">
            {part.badge}
          </span>
        )}
        <button className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-50">
          <Heart className="h-4 w-4 text-gray-400 transition-colors hover:text-red-500 hover:fill-red-500" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-1 text-sm font-bold text-[#1A1A1B]">{part.name}</h3>
        <p className="mb-3 text-xs text-[#777777]">{part.carModel}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-black text-[#102a50]">
              {formatPrice(part.price)}
            </span>
            <span className="mr-1 text-xs text-[#777777]">تومان</span>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066ff] text-white transition-all hover:bg-[#0052cc] hover:shadow-lg hover:shadow-[#0066ff]/30">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export async function Bestsellers() {
  let parts = fallbackParts;

  try {
    const result = await searchParts({
      size: 5,
      sortBy: "price",
      sortDir: "DESC",
    });

    if (result.items.length > 0) {
      const images = fallbackParts.map((p) => p.image);
      const carModels = fallbackParts.map((p) => p.carModel);
      const badges = ["پرفروش", undefined, "جدید", undefined, "ویژه"];

      parts = result.items.slice(0, 5).map((item, i): BestsellerPart => {
        const part: BestsellerPart = {
          name: item.name ?? "قطعه",
          carModel: carModels[i % carModels.length]!,
          price: item.price ?? 0,
          image: images[i % images.length]!,
        };
        const badge = badges[i % badges.length];
        if (badge) part.badge = badge;
        return part;
      });
    }
  } catch {
    // Use fallback data
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="پرفروش‌ترین قطعات"
          href="/bestsellers"
          linkText="مشاهده همه"
        />
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide lg:gap-5">
          {parts.map((part) => (
            <ProductCard key={part.name} part={part} />
          ))}
        </div>
      </div>
    </section>
  );
}
