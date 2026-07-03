export class ServerSaveError extends Error {
  readOnly: boolean;

  constructor(message: string, readOnly = false) {
    super(message);
    this.name = "ServerSaveError";
    this.readOnly = readOnly;
  }
}

export async function readServerJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ServerSaveError(payload?.error || "服务器数据读取失败。", Boolean(payload?.readOnly));
  }
  return payload as T;
}

export async function writeServerJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ServerSaveError(payload?.error || "服务器保存失败。", Boolean(payload?.readOnly));
  }
  return payload as T;
}
