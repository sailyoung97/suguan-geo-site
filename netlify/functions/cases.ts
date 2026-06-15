import { connectLambda, getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

const adminAuthCookieName = "suguan.admin.auth.v1";
const configKey = "cases.json";

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

export const handler: Handler = async (event) => {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  const store = getStore("suguan-config");

  if (event.httpMethod === "GET") {
    const cases = await store.get(configKey, { type: "json" }).catch(() => null);
    return json(200, Array.isArray(cases) ? cases : []);
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  if (!isLoggedIn(event.headers.cookie || event.headers.Cookie || "")) {
    return json(401, { error: "未登录，不能保存案例数据。" });
  }

  try {
    const parsed = JSON.parse(event.body || "{}");
    const cases = Array.isArray(parsed.cases) ? parsed.cases : [];
    await store.setJSON(configKey, cases);
    return json(200, { ok: true, cases });
  } catch (error) {
    console.error("Save cases failed:", error);
    return json(500, { error: "案例数据保存失败。" });
  }
};
