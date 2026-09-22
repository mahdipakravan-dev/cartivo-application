import Image from "next/image";

const features = [
  {
    src: "/images/advertisements/promo-sellers.webp",
    alt: "به جمع فروشندگان کارتیوُ بپیوندید",
  },
  {
    src: "/images/advertisements/promo-shipping.webp",
    alt: "کارتیوُ، همراه مسیر شما در هر کیلومتر",
  },
] as const;

export function Features() {
  return (
    <section
      id="services"
      className="bg-white py-14 sm:py-16"
      aria-label="خدمات کارتیوُ"
    >
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <figure
              key={feature.src}
              className="relative aspect-[8/3] overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={feature.src}
                alt={feature.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
