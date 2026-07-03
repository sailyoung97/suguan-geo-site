import { NextResponse } from "next/server";
import { ReadOnlyStorageError } from "@/src/server/jsonStorage";

export function apiError(error: unknown) {
  if (error instanceof ReadOnlyStorageError) {
    return NextResponse.json({ error: error.message, readOnly: true }, { status: 503 });
  }

  console.error(error);
  return NextResponse.json({ error: "服务器保存失败，请检查数据目录权限和服务器日志。" }, { status: 500 });
}

export function unauthorized() {
  return NextResponse.json({ error: "登录状态无效，不能修改服务器数据。" }, { status: 401 });
}
