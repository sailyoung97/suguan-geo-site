import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "内部登录",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-12 text-paper">
      <Suspense fallback={<div className="border border-paper/18 bg-paper/[0.06] px-6 py-5 text-sm text-paper/62">正在加载登录页...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
