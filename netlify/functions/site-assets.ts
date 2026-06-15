import { connectLambda, getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

const adminAuthCookieName = "suguan.admin.auth.v1";
const configKey = "site-assets.json";

function json(statusCode: number, payload: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  };
}

function isLoggedIn(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .some((item) => item === `${adminAuthCookieName}=authenticated`);
}

function normalizeAssets(value: unknown) {
  if (!value || typeof value !== "object") return {};

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>((assets, [key, path]) => {
    if (typeof path === "string" && path.trim() && !path.startsWith("data:") && !path.startsWith("blob:")) {
      assets[key] = path.trim();
    }
    return assets;
  }, {});
}

export const handler: Handler = async (event) => {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  const store = getStore("suguan-config");

  if (event.httpMethod === "GET") {
    const assets = await store.get(configKey, { type: "json" }).catch(() => null);
    return json(200, normalizeAssets(assets));
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  if (!isLoggedIn(event.headers.cookie || event.headers.Cookie || "")) {
    return json(401, { error: "未登录，不能保存素材配置。" });
  }

  try {
    const parsed = JSON.parse(event.body || "{}");
    const assets = normalizeAssets(parsed.assets);
    await store.setJSON(configKey, assets);
    return json(200, { ok: true, assets });
  } catch (error) {
    console.error("Save site assets failed:", error);
    return json(500, { error: "素材配置保存失败。" });
  }
};
