import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * صفحه‌ی خانه — فعلاً یک نقطه‌ی شروع مینیمال که به صفحه‌ی نمونه‌ی
 * /brands لینک می‌دهد. صفحه‌ی خانه‌ی واقعی بعداً طراحی می‌شود.
 */
export default function HomePage() {
  return (
    <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        زیرساخت فرانت‌اند کارتیوو آماده است
      </p>
      <h1 className="max-w-2xl text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
        قطعه‌ی درست، برای خودروی درست
      </h1>
      <p className="max-w-xl text-pretty leading-8 text-muted-foreground">
        مارکت‌پلیس چندفروشندگی قطعات یدکی خودرو — جست‌وجو بر اساس برند، مدل و
        سال ساخت، با مقایسه‌ی قیمت فروشندگان.
      </p>
      <Button asChild size="lg">
        <Link href="/brands">مشاهده‌ی برندهای خودرو</Link>
      </Button>
    </section>
  );
}
