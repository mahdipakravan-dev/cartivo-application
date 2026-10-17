import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const features = [
  {
    src: "/images/advertisements/promo-sellers.webp",
    alt: "به جمع فروشندگان کارتیو بپیوندید",
    href: ROUTES.sellerJoin,
  },
  {
    src: "/images/advertisements/promo-shipping.webp",
    alt: "کارتیو، همراه مسیر شما در هر کیلومتر",
    href: ROUTES.about,
  },
] as const;

export function Features() {
  return (
    <section
      id="services"
      className="bg-white py-14 sm:py-16"
      aria-label="خدمات کارتیو"
    >
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.src}
              href={feature.href}
              aria-label={feature.alt}
              className="group relative aspect-[8/3] overflow-hidden rounded-2xl bg-muted shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgb(15_48_90/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <Image
                src={feature.src}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
