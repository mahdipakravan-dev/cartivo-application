export const PART_FINDER_FIELDS = ["year", "brand", "car"] as const;

export const PRODUCTION_YEAR_OPTIONS = Array.from(
  { length: 46 },
  (_, index) => {
    const year = 1405 - index;
    return { value: String(year), label: year.toLocaleString("fa-IR", { useGrouping: false }) };
  }
);
