import type { PartDetail } from "@/lib/api/types";
import { formatPartDetail } from "@/lib/part-details";

export function PartSpecifications({ details }: { details: PartDetail[] }) {
  if (details.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-[1.75rem] bg-white p-6 shadow-[0_12px_40px_rgb(15_23_42/0.04)] sm:p-8"
      aria-labelledby="part-specifications-title"
    >
      <div className="mb-5">
        <p className="text-xs font-bold text-accent">اطلاعات محصول</p>
        <h2
          id="part-specifications-title"
          className="mt-2 text-xl font-black text-dark"
        >
          مشخصات فنی
        </h2>
      </div>
      <dl className="overflow-hidden rounded-2xl border border-border">
        {details.map((detail, index) => (
          <div
            key={`${detail.categoryId}-${detail.key}`}
            className={`grid grid-cols-[minmax(110px,35%)_1fr] gap-4 px-4 py-3.5 text-sm sm:grid-cols-[220px_1fr] sm:px-5 ${index % 2 === 0 ? "bg-background/70" : "bg-white"}`}
          >
            <dt className="font-medium text-text-secondary">{detail.label}</dt>
            <dd className="font-bold text-text-muted">
              {formatPartDetail(detail)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
