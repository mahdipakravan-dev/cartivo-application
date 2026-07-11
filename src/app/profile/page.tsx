import type { Metadata } from "next";
import { ProfileDashboard } from "./_components/profile-dashboard";

export const metadata: Metadata = {
  title: "حساب کاربری من",
  description: "مشاهده و ویرایش اطلاعات حساب و پیگیری سفارش‌های کارتیوو.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileDashboard />;
}
