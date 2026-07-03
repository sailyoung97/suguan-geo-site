import { randomUUID } from "crypto";
import { copyFile, mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "fs/promises";
import path from "path";

const dataFileNames = {
  cases: "cases.json",
  articles: "articles.json",
  siteAssets: "site-assets.json",
  siteContent: "site-content.json"
} as const;

export type JsonDataKey = keyof typeof dataFileNames;

export class ReadOnlyStorageError extends Error {
  constructor() {
    super("当前部署环境为只读模式，不能保存服务器数据。请在腾讯云 Node.js 服务器或本地开发环境中操作。");
    this.name = "ReadOnlyStorageError";
  }
}

function isNetlifyRuntime() {
  return process.env.NETLIFY === "true";
}

export function isServerStorageWritable() {
  return !isNetlifyRuntime() || process.env.SUGUAN_ALLOW_FILE_WRITES === "true";
}

export function getStoragePaths() {
  const configuredRoot = process.env.SUGUAN_STORAGE_ROOT?.trim();
  const root = configuredRoot || path.join(process.cwd(), ".data");

  return {
    root,
    dataDir: path.join(root, "data"),
    backupDir: path.join(root, "backups"),
    uploadDir: path.join(root, "uploads")
  };
}

function timestamp() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ];
  return `${parts[0]}${parts[1]}${parts[2]}-${parts[3]}${parts[4]}${parts[5]}`;
}

async function exists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectories() {
  const paths = getStoragePaths();
  await Promise.all([
    mkdir(paths.dataDir, { recursive: true }),
    mkdir(paths.backupDir, { recursive: true }),
    mkdir(paths.uploadDir, { recursive: true })
  ]);
  return paths;
}

async function pruneBackups(prefix: string) {
  const { backupDir } = getStoragePaths();
  const names = (await readdir(backupDir).catch(() => []))
    .filter((name) => name.startsWith(`${prefix}-`) && name.endsWith(".json"))
    .sort()
    .reverse();

  await Promise.all(names.slice(20).map((name) => unlink(path.join(backupDir, name)).catch(() => undefined)));
}

export async function readJsonData<T>(key: JsonDataKey, fallback: T): Promise<T> {
  const { dataDir } = getStoragePaths();
  const filePath = path.join(dataDir, dataFileNames[key]);

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    if (isServerStorageWritable()) {
      await writeJsonData(key, fallback, { skipBackup: true });
    }
    return fallback;
  }
}

export async function writeJsonData<T>(
  key: JsonDataKey,
  value: T,
  options: { skipBackup?: boolean } = {}
) {
  if (!isServerStorageWritable()) {
    throw new ReadOnlyStorageError();
  }

  const { dataDir, backupDir } = await ensureDirectories();
  const fileName = dataFileNames[key];
  const filePath = path.join(dataDir, fileName);
  const prefix = path.basename(fileName, ".json");

  if (!options.skipBackup && (await exists(filePath))) {
    await copyFile(filePath, path.join(backupDir, `${prefix}-${timestamp()}.json`));
    await pruneBackups(prefix);
  }

  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

export async function saveUploadedImage(fileName: string, bytes: Uint8Array) {
  if (!isServerStorageWritable()) {
    throw new ReadOnlyStorageError();
  }

  const { uploadDir } = await ensureDirectories();
  const outputPath = path.join(uploadDir, fileName);
  await writeFile(outputPath, bytes);
  return outputPath;
}

export function resolveUploadedImage(fileName: string) {
  const safeName = path.basename(fileName);
  return path.join(getStoragePaths().uploadDir, safeName);
}

export function resolveBundledImage(fileName: string) {
  const safeName = path.basename(fileName);
  return path.join(process.cwd(), "public", "uploads", safeName);
}
