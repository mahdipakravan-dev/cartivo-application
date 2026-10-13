import type { PartDetail } from "@/lib/api/types";

export function formatPartDetail(detail: PartDetail): string {
  let value: string;

  switch (detail.dataType) {
    case "BOOLEAN":
      value = detail.value ? "بله" : "خیر";
      break;
    case "MULTI_SELECT":
      value = Array.isArray(detail.value)
        ? detail.value.join("، ")
        : String(detail.value);
      break;
    default:
      value = String(detail.value);
  }

  return detail.unit ? `${value} ${detail.unit}` : value;
}
