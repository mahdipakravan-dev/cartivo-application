"use client";

import { useEffect, useState } from "react";
import { useForm, type RegisterOptions, type UseFormReturn } from "react-hook-form";
import { ArrowRight, CheckCircle2, LoaderCircle, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/api/auth-token";
import { getProfile, requestOtp, updateProfile, verifyOtp, type CustomerProfile } from "@/lib/api/auth";

type Step = "phone" | "otp" | "profile";
type PhoneForm = { phoneNumber: string };
type OtpForm = { code: string };
type ProfileForm = { firstName: string; lastName: string; email: string; nationalCode: string };

const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const cleanPhone = (value: string) => toEnglishDigits(value).replace(/\D/g, "").slice(0, 11);
const toInternationalPhone = (value: string) => `+98${cleanPhone(value).slice(1)}`;
const localPhone = (value?: string) => value?.startsWith("+98") ? `0${value.slice(3)}` : value || "";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticationChange: (authenticated: boolean) => void;
}

export function AccountDialog({ open, onOpenChange, onAuthenticationChange }: AccountDialogProps) {
  const [step, setStep] = useState<Step>(getAccessToken() ? "profile" : "phone");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [saved, setSaved] = useState(false);

  const phoneForm = useForm<PhoneForm>({ defaultValues: { phoneNumber: "" } });
  const otpForm = useForm<OtpForm>({ defaultValues: { code: "" } });
  const profileForm = useForm<ProfileForm>({
    defaultValues: { firstName: "", lastName: "", email: "", nationalCode: "" },
  });

  useEffect(() => {
    if (!open || step !== "profile" || profile) return;
    setLoadingProfile(true);
    getProfile()
      .then((data) => {
        setProfile(data);
        profileForm.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          nationalCode: data.nationalCode || "",
        });
      })
      .catch(() => {
        clearAccessToken();
        onAuthenticationChange(false);
        setStep("phone");
      })
      .finally(() => setLoadingProfile(false));
  }, [open, step, profile, profileForm, onAuthenticationChange]);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onOpenChange]);

  if (!open) return null;

  const sendOtp = async (phoneNumber: string) => {
    setRequestError("");
    const normalized = cleanPhone(phoneNumber);
    try {
      await requestOtp(toInternationalPhone(normalized));
      setPhone(normalized);
      setStep("otp");
      setRemaining(120);
      otpForm.reset();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "ارسال کد با خطا مواجه شد.");
    }
  };

  const submitOtp = async ({ code }: OtpForm) => {
    setRequestError("");
    try {
      const result = await verifyOtp(toInternationalPhone(phone), toEnglishDigits(code));
      if (!result.accessToken) throw new Error("توکن ورود از سرور دریافت نشد.");
      setAccessToken(result.accessToken);
      onAuthenticationChange(true);
      setProfile(null);
      setStep("profile");
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "کد واردشده معتبر نیست.");
    }
  };

  const submitProfile = async (values: ProfileForm) => {
    setRequestError("");
    setSaved(false);
    try {
      const payload = {
        ...(values.firstName && { firstName: values.firstName }),
        ...(values.lastName && { lastName: values.lastName }),
        ...(values.email && { email: values.email }),
        ...(values.nationalCode && { nationalCode: toEnglishDigits(values.nationalCode) }),
      };
      const result = await updateProfile(payload);
      setProfile(result);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "ذخیره پروفایل انجام نشد.");
    }
  };

  const logout = () => {
    clearAccessToken();
    onAuthenticationChange(false);
    setProfile(null);
    setPhone("");
    phoneForm.reset();
    setStep("phone");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onOpenChange(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" className="relative w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-md sm:rounded-[2rem]" dir="rtl">
        <div className="h-1.5 bg-gradient-to-l from-[#14305A] via-sky-500 to-cyan-300" />
        <Button type="button" variant="ghost" size="icon" className="absolute left-4 top-5 rounded-full text-slate-400" aria-label="بستن" onClick={() => onOpenChange(false)}>
          <X />
        </Button>

        <div className="px-6 pb-7 pt-7 sm:px-8">
          {step !== "profile" && (
            <div className="mb-7">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#14305A] text-white shadow-lg shadow-blue-950/20">
                <ShieldCheck className="size-7" />
              </div>
              <h2 id="account-dialog-title" className="text-xl font-extrabold text-slate-900">ورود به حساب کارتیوو</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">سریع و امن، فقط با شماره موبایل شما</p>
            </div>
          )}

          {step === "phone" && (
            <form onSubmit={phoneForm.handleSubmit(({ phoneNumber }) => sendOtp(phoneNumber))} noValidate>
              <label htmlFor="phoneNumber" className="mb-2 block text-sm font-bold text-slate-700">شماره موبایل</label>
              <div className="relative" dir="ltr">
                <Input
                  id="phoneNumber"
                  inputMode="numeric"
                  autoComplete="tel"
                  autoFocus
                  placeholder="09369514975"
                  aria-invalid={!!phoneForm.formState.errors.phoneNumber}
                  className="h-12 rounded-xl px-4 text-left text-base tracking-wider"
                  {...phoneForm.register("phoneNumber", {
                    required: "شماره موبایل را وارد کنید.",
                    validate: (value) => /^09\d{9}$/.test(cleanPhone(value)) || "شماره موبایل باید مانند 09369514975 باشد.",
                    onChange: (event) => phoneForm.setValue("phoneNumber", cleanPhone(event.target.value)),
                  })}
                />
              </div>
              <FormMessage message={phoneForm.formState.errors.phoneNumber?.message || requestError} />
              <Button type="submit" size="lg" className="mt-5 h-12 w-full rounded-xl text-base" disabled={phoneForm.formState.isSubmitting}>
                {phoneForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "دریافت کد ورود"}
              </Button>
              <p className="mt-4 text-center text-xs leading-5 text-slate-400">با ورود، قوانین و شرایط استفاده از کارتیوو را می‌پذیرید.</p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={otpForm.handleSubmit(submitOtp)} noValidate>
              <button type="button" onClick={() => { setStep("phone"); setRequestError(""); }} className="mb-5 inline-flex items-center gap-1 text-sm font-bold text-[#14305A]">
                <ArrowRight className="size-4" /> تغییر شماره
              </button>
              <p className="mb-5 text-sm leading-6 text-slate-600">کد ارسال‌شده به <b dir="ltr" className="inline-block text-slate-900">{phone}</b> را وارد کنید.</p>
              <label htmlFor="otpCode" className="mb-2 block text-sm font-bold text-slate-700">کد یک‌بار مصرف</label>
              <Input
                id="otpCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={5}
                placeholder="-----"
                dir="ltr"
                aria-invalid={!!otpForm.formState.errors.code}
                className="h-14 rounded-xl text-center text-2xl font-bold tracking-[0.6em]"
                {...otpForm.register("code", {
                  required: "کد ورود را وارد کنید.",
                  pattern: { value: /^\d{5}$/, message: "کد ورود باید ۵ رقم باشد." },
                  onChange: (event) => otpForm.setValue("code", toEnglishDigits(event.target.value).replace(/\D/g, "").slice(0, 5)),
                })}
              />
              <FormMessage message={otpForm.formState.errors.code?.message || requestError} />
              <Button type="submit" size="lg" className="mt-5 h-12 w-full rounded-xl text-base" disabled={otpForm.formState.isSubmitting}>
                {otpForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "ورود به حساب"}
              </Button>
              <div className="mt-5 text-center text-sm text-slate-500">
                {remaining > 0 ? <>ارسال دوباره تا <span dir="ltr" className="font-bold text-slate-700">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</span></> : (
                  <button type="button" className="font-bold text-[#14305A]" onClick={() => sendOtp(phone)}>ارسال دوباره کد</button>
                )}
              </div>
            </form>
          )}

          {step === "profile" && (
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#14305A]"><UserRound className="size-6" /></div>
                <div><h2 id="account-dialog-title" className="font-extrabold text-slate-900">حساب کاربری من</h2><p dir="ltr" className="mt-1 text-right text-xs text-slate-400">{localPhone(profile?.phoneNumber)}</p></div>
              </div>
              {loadingProfile ? <div className="flex min-h-48 items-center justify-center"><LoaderCircle className="size-7 animate-spin text-[#14305A]" /></div> : (
                <form onSubmit={profileForm.handleSubmit(submitProfile)} className="grid grid-cols-2 gap-3" noValidate>
                  <ProfileField label="نام" name="firstName" form={profileForm} />
                  <ProfileField label="نام خانوادگی" name="lastName" form={profileForm} />
                  <div className="col-span-2"><ProfileField label="ایمیل" name="email" type="email" form={profileForm} rules={{ pattern: { value: /^\S+@\S+\.\S+$/, message: "ایمیل معتبر نیست." } }} /></div>
                  <div className="col-span-2"><ProfileField label="کد ملی" name="nationalCode" inputMode="numeric" form={profileForm} rules={{ validate: (value: string) => !value || /^\d{10}$/.test(toEnglishDigits(value)) || "کد ملی باید ۱۰ رقم باشد." }} /></div>
                  <FormMessage message={requestError} className="col-span-2" />
                  {saved && <p className="col-span-2 flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="size-4" /> تغییرات ذخیره شد.</p>}
                  <Button type="submit" className="col-span-2 mt-2 h-11 rounded-xl" disabled={profileForm.formState.isSubmitting}>{profileForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "ذخیره تغییرات"}</Button>
                  <Button type="button" variant="ghost" className="col-span-2 text-slate-500 hover:text-red-600" onClick={logout}><LogOut /> خروج از حساب</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FormMessage({ message, className = "" }: { message?: string | undefined; className?: string }) {
  return message ? <p role="alert" className={`mt-2 text-xs font-medium text-red-600 ${className}`}>{message}</p> : null;
}

interface ProfileFieldProps {
  label: string;
  name: keyof ProfileForm;
  form: UseFormReturn<ProfileForm>;
  type?: string;
  inputMode?: "numeric" | "text" | "email";
  rules?: RegisterOptions<ProfileForm, keyof ProfileForm>;
}

function ProfileField({ label, name, form, type = "text", inputMode, rules }: ProfileFieldProps) {
  const error = form.formState.errors[name]?.message as string | undefined;
  return (
    <label className="block text-xs font-bold text-slate-600">{label}
      <Input type={type} inputMode={inputMode} aria-invalid={!!error} className="mt-1.5 h-10 rounded-xl font-normal" {...form.register(name, rules)} />
      <FormMessage message={error} />
    </label>
  );
}
