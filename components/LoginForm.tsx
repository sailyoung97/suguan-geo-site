"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import { siteAssets } from "@/src/config/siteAssets";
import { validateAdminCredentials, writeAdminAuth } from "@/src/lib/adminAuth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validateAdminCredentials(username, password)) {
      setError("账号或密码错误，请重新输入。");
      return;
    }

    const saved = writeAdminAuth(username.trim());
    if (!saved) {
      setError("登录状态保存失败，请检查浏览器本地存储设置。");
      return;
    }

    const redirect = searchParams.get("redirect");
    router.replace(redirect?.startsWith("/admin") ? redirect : "/admin/leads");
  };

  return (
    <section className="w-full max-w-md border border-paper/18 bg-paper/[0.06] p-6 shadow-soft backdrop-blur sm:p-8">
      <div className="flex items-center gap-4">
        <SiteAssetImage
          asset={siteAssets.logo}
          className="h-12 w-12 border border-paper/30 bg-paper/10"
          fallbackLabel="观"
          variant="mark"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-paper/48">SUGUAN ADMIN</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">溯观 GEO 中台登录</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm text-paper/72">
          账号
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="h-12 border border-paper/22 bg-ink/55 px-4 text-base text-paper outline-none transition placeholder:text-paper/28 focus:border-paper"
            placeholder="请输入管理员账号"
          />
        </label>

        <label className="grid gap-2 text-sm text-paper/72">
          密码
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="h-12 border border-paper/22 bg-ink/55 px-4 text-base text-paper outline-none transition placeholder:text-paper/28 focus:border-paper"
            placeholder="请输入管理员密码"
          />
        </label>

        {error ? <div className="border border-clay/40 bg-clay/12 px-4 py-3 text-sm text-paper">{error}</div> : null}

        <button
          type="submit"
          className="mt-2 bg-paper px-5 py-3 text-sm font-medium text-ink transition hover:bg-clay"
        >
          登录
        </button>
      </form>
    </section>
  );
}
