"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  createGarageVehicle,
  type GarageVehicle,
  type GarageVehicleCreateRequest,
} from "@/lib/api/garage";
import {
  getVehicleBrands,
  getVehicleModels,
  getVehicleModelYears,
  getVehicleVariants,
  type VehicleBrand,
  type VehicleModel,
  type VehicleModelYear,
  type VehicleVariant,
} from "@/lib/api/vehicle-selector";

interface GarageVehicleFormProps {
  onCreated: (vehicle: GarageVehicle) => void;
}

export function GarageVehicleForm({ onCreated }: GarageVehicleFormProps) {
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [modelYearId, setModelYearId] = useState("");
  const [vin, setVin] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [modelYears, setModelYears] = useState<VehicleModelYear[]>([]);
  const [loadingStep, setLoadingStep] = useState<
    "brands" | "models" | "variants" | "years" | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const brandOptions = useMemo(
    () =>
      brands.flatMap((brand) =>
        brand.id == null
          ? []
          : [
              {
                value: String(brand.id),
                label: brand.name || brand.englishName || `برند ${brand.id}`,
              },
            ],
      ),
    [brands],
  );
  const modelOptions = useMemo(
    () =>
      models.flatMap((model) =>
        model.id == null
          ? []
          : [
              {
                value: String(model.id),
                label: model.name || model.englishName || `مدل ${model.id}`,
              },
            ],
      ),
    [models],
  );
  const variantOptions = useMemo(
    () =>
      variants.flatMap((variant) =>
        variant.id == null
          ? []
          : [
              {
                value: String(variant.id),
                label:
                  variant.displayName || variant.name || `تیپ ${variant.id}`,
              },
            ],
      ),
    [variants],
  );
  const modelYearOptions = useMemo(
    () =>
      modelYears.map((modelYear) => ({
        value: String(modelYear.id),
        label: modelYear.year.toLocaleString("fa-IR", { useGrouping: false }),
      })),
    [modelYears],
  );

  useEffect(() => {
    let active = true;
    setLoadingStep("brands");
    getVehicleBrands()
      .then((result) => active && setBrands(result))
      .catch(() => active && setError("دریافت فهرست برندها انجام نشد."))
      .finally(() => active && setLoadingStep(null));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!brandId) return;
    let active = true;
    setLoadingStep("models");
    setError("");
    getVehicleModels(Number(brandId))
      .then((result) => active && setModels(result))
      .catch(() => active && setError("دریافت فهرست مدل‌ها انجام نشد."))
      .finally(() => active && setLoadingStep(null));
    return () => {
      active = false;
    };
  }, [brandId]);

  useEffect(() => {
    if (!modelId) return;
    let active = true;
    setLoadingStep("variants");
    setError("");
    getVehicleVariants(Number(modelId))
      .then((result) => active && setVariants(result))
      .catch(() => active && setError("دریافت فهرست نسل و تیپ‌ها انجام نشد."))
      .finally(() => active && setLoadingStep(null));
    return () => {
      active = false;
    };
  }, [modelId]);

  useEffect(() => {
    if (!variantId) return;
    let active = true;
    setLoadingStep("years");
    setError("");
    getVehicleModelYears(Number(variantId))
      .then((result) => active && setModelYears(result))
      .catch(() => active && setError("دریافت سال‌های تولید انجام نشد."))
      .finally(() => active && setLoadingStep(null));
    return () => {
      active = false;
    };
  }, [variantId]);

  const selectBrand = (value: string) => {
    setBrandId(value);
    setModelId("");
    setVariantId("");
    setModelYearId("");
    setModels([]);
    setVariants([]);
    setModelYears([]);
  };
  const selectModel = (value: string) => {
    setModelId(value);
    setVariantId("");
    setModelYearId("");
    setVariants([]);
    setModelYears([]);
  };
  const selectVariant = (value: string) => {
    setVariantId(value);
    setModelYearId("");
    setModelYears([]);
  };

  const reset = () => {
    setBrandId("");
    setModelId("");
    setVariantId("");
    setModelYearId("");
    setVin("");
    setPlateNumber("");
    setNickname("");
    setColor("");
    setMileage("");
    setIsDefault(false);
    setModels([]);
    setVariants([]);
    setModelYears([]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!modelYearId) return;
    setSaving(true);
    setSaved(false);
    setError("");

    const payload: GarageVehicleCreateRequest = {
      carModelYearId: Number(modelYearId),
      ...(vin.trim() && { vin: vin.trim() }),
      ...(plateNumber.trim() && { plateNumber: plateNumber.trim() }),
      ...(nickname.trim() && { nickname: nickname.trim() }),
      ...(color.trim() && { color: color.trim() }),
      ...(mileage !== "" && { mileage: Number(mileage) }),
      isDefault,
    };

    try {
      const created = await createGarageVehicle(payload);
      onCreated(created);
      window.dispatchEvent(new Event("cartivo-garage-change"));
      reset();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "ذخیره خودرو انجام نشد.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-7 rounded-2xl  bg-background/70 p-4 sm:p-6"
    >
      <div>
        <h3 className="text-base font-black text-dark">
          افزودن خودرو به گاراژ
        </h3>
        <p className="mt-1 text-xs leading-6 text-text-secondary">
          ابتدا مشخصات کاتالوگ خودرو و سپس اطلاعات اختیاری خودروی خود را وارد
          کنید.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SearchableSelect
          options={brandOptions}
          value={brandId}
          onValueChange={selectBrand}
          placeholder="انتخاب برند"
          searchPlaceholder="جست‌وجوی برند..."
          disabled={loadingStep === "brands"}
          emptyMessage={
            loadingStep === "brands" ? "در حال بارگذاری..." : "برندی یافت نشد"
          }
        />
        <SearchableSelect
          options={modelOptions}
          value={modelId}
          onValueChange={selectModel}
          placeholder="انتخاب مدل"
          searchPlaceholder="جست‌وجوی مدل..."
          disabled={!brandId || loadingStep === "models"}
          emptyMessage={
            loadingStep === "models" ? "در حال بارگذاری..." : "مدلی یافت نشد"
          }
        />
        <SearchableSelect
          options={variantOptions}
          value={variantId}
          onValueChange={selectVariant}
          placeholder="انتخاب نسل و تیپ"
          searchPlaceholder="جست‌وجوی نسل یا تیپ..."
          disabled={!modelId || loadingStep === "variants"}
          emptyMessage={
            loadingStep === "variants" ? "در حال بارگذاری..." : "تیپی یافت نشد"
          }
        />
        <SearchableSelect
          options={modelYearOptions}
          value={modelYearId}
          onValueChange={setModelYearId}
          placeholder="انتخاب سال تولید"
          searchPlaceholder="جست‌وجوی سال تولید..."
          disabled={!variantId || loadingStep === "years"}
          emptyMessage={
            loadingStep === "years" ? "در حال بارگذاری..." : "سالی یافت نشد"
          }
        />
      </div>

      <div className="my-6 h-px bg-border/20/70" />
      <div className="grid gap-4 sm:grid-cols-2">
        <GarageField label="نام دلخواه">
          <Input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="مثلاً ماشین من"
            className="h-11 bg-white"
          />
        </GarageField>
        <GarageField label="رنگ">
          <Input
            value={color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="مثلاً سفید"
            className="h-11 bg-white"
          />
        </GarageField>
        <GarageField label="شماره VIN">
          <Input
            dir="ltr"
            value={vin}
            onChange={(event) => setVin(event.target.value)}
            placeholder="IR12345678901"
            className="h-11 bg-white text-left"
          />
        </GarageField>
        <GarageField label="شماره پلاک">
          <Input
            value={plateNumber}
            onChange={(event) => setPlateNumber(event.target.value)}
            placeholder="۱۲ الف ۳۴۵ ایران ۶۷"
            className="h-11 bg-white"
          />
        </GarageField>
        <GarageField label="کارکرد (کیلومتر)">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={mileage}
            onChange={(event) => setMileage(event.target.value)}
            placeholder="45000"
            className="h-11 bg-white"
          />
        </GarageField>
        <label className="flex h-11 items-center gap-3 self-end rounded-xl  bg-white px-4 text-xs font-bold text-text-muted">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
            className="size-4 accent-primary"
          />
          خودروی پیش‌فرض من باشد
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
          <CheckCircle2 className="size-4" /> خودرو با موفقیت به گاراژ اضافه شد.
        </p>
      )}

      <Button
        type="submit"
        disabled={!modelYearId || saving}
        className="mt-6 h-12 w-full rounded-xl text-sm font-bold sm:w-auto sm:min-w-48"
      >
        {saving ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>
            <Plus className="size-4" /> افزودن به گاراژ
          </>
        )}
      </Button>
    </form>
  );
}

function GarageField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-xs font-bold text-text-muted">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
