"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import type { SiteAsset } from "@/src/config/siteAssets";
import { siteAssets } from "@/src/config/siteAssets";
import { useSiteAssets } from "@/src/hooks/useSiteAssets";
import { uploadImage } from "@/src/lib/uploadImage";

type AssetRow = {
  name: string;
  usage: string;
  asset: SiteAsset;
  size: string;
  note: string;
  fallbackLabel: string;
  recommendedPath: string;
  variant?: "default" | "mark" | "qr";
};

const maxPreviewInputSize = 2 * 1024 * 1024;
const warningPreviewInputSize = 1 * 1024 * 1024;
const maxCanvasWidth = 1600;
const previewQuality = 0.75;

type ImageAccessStatus = "idle" | "checking" | "missing" | "ok" | "error";

const assetRows: AssetRow[] = [
  {
    name: "Logo",
    usage: "前台官网顶部导航 / 品牌识别",
    asset: siteAssets.logo,
    size: "建议 SVG 或 512 x 512px 透明 PNG",
    note: "用于全站品牌露出，深浅底色下都需保持清晰。",
    fallbackLabel: "观",
    recommendedPath: "/uploads/logo.jpg",
    variant: "mark"
  },
  {
    name: "首页主视觉图",
    usage: "首页首屏右侧主视觉区域",
    asset: siteAssets.homeHeroImage,
    size: "1920 x 1400px 或更高，适配裁切",
    note: "大图建议放入 public/uploads 后填写路径，不建议使用本地临时预览。",
    fallbackLabel: "Home Hero Image",
    recommendedPath: "/uploads/home-hero.png"
  },
  {
    name: "首页首屏超宽底图",
    usage: "首页首屏 / SUGUAN 英文字下方",
    asset: siteAssets.homeHeroWideImage,
    size: "1920 x 700px 或更宽的横图",
    note: "用于首页首屏超大 SUGUAN 字下方的横向品牌视觉底图，建议使用超宽横图并放入 public/uploads 后填写路径。",
    fallbackLabel: "首页首屏超宽底图待上传",
    recommendedPath: "/uploads/home-hero.png"
  },
  {
    name: "品牌资产矩阵图",
    usage: "首页第二屏「品牌与项目资产」模块",
    asset: siteAssets.brandAssetsImage,
    size: "1920 x 1080px 或 1920 x 1200px",
    note: "由平面设计同事制作整张 Logo / 品牌资产矩阵大图，放入 public/uploads 后填写路径即可。",
    fallbackLabel: "品牌资产矩阵图待上传",
    recommendedPath: "/uploads/brand-assets-matrix.png"
  },
  {
    name: "关于溯观首屏图",
    usage: "关于溯观页面顶部介绍区",
    asset: siteAssets.aboutHeroImage,
    size: "1600 x 1000px，16:10",
    note: "建议使用“溯观文化产业发展机构”品牌图，作为关于页顶部左侧大图视觉。",
    fallbackLabel: "About Image",
    recommendedPath: "/uploads/about-hero.jpg"
  },
  {
    name: "公众号二维码 / 品牌二维码",
    usage: "首页首屏联系区 / 二维码 1",
    asset: siteAssets.contactQrCode01,
    size: "800 x 800px，正方形；前台显示约 120px",
    note: "用于首页首屏按钮下方联系区。未配置时前台显示“二维码待上传”占位，不出现破图。",
    fallbackLabel: "二维码待上传",
    recommendedPath: "/uploads/qrcode-official.jpg",
    variant: "qr"
  },
  {
    name: "项目咨询二维码 / 客服二维码",
    usage: "首页首屏联系区 / 二维码 2",
    asset: siteAssets.contactQrCode02,
    size: "800 x 800px，正方形；前台显示约 120px",
    note: "用于首页首屏项目咨询入口，可放企业微信、客服或项目咨询二维码。",
    fallbackLabel: "二维码待上传",
    recommendedPath: "/uploads/qrcode-wecom.png",
    variant: "qr"
  },
  {
    name: "公众号二维码",
    usage: "联系我们页面 / 扫码联系区",
    asset: siteAssets.qrcodes.wechatOfficial,
    size: "800 x 800px，正方形",
    note: "替换为正式公众号二维码后，建议保留足够白边。",
    fallbackLabel: "QR",
    recommendedPath: "/uploads/qrcode-official.jpg",
    variant: "qr"
  },
  {
    name: "企业微信二维码",
    usage: "联系我们页面 / 扫码联系区",
    asset: siteAssets.qrcodes.enterpriseWechat,
    size: "800 x 800px，正方形",
    note: "用于项目咨询、资料包领取和商务沟通承接。",
    fallbackLabel: "QR",
    recommendedPath: "/uploads/qrcode-wecom.png",
    variant: "qr"
  },
  {
    name: "专业背书证书图",
    usage: "专业背书模块 / 后续可用于协会身份或资质展示",
    asset: siteAssets.professionalProof.certificate,
    size: "1600 x 1000px 或证书原始比例",
    note: "可放协会证书、资质证明、荣誉材料或授权证明图片。",
    fallbackLabel: "Certificate Image",
    recommendedPath: "/uploads/proof-certificate.jpg"
  }
];

export function SiteAssetsManager() {
  const { uploadedAssets, clearAssets } = useSiteAssets();
  const [message, setMessage] = useState("");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const setPreviewUrl = (assetKey: string, url: string) => {
    setPreviewUrls((current) => {
      if (current[assetKey]) {
        URL.revokeObjectURL(current[assetKey]);
      }
      return { ...current, [assetKey]: url };
    });
  };

  const clearAllAssets = async () => {
    try {
      await clearAssets();
      setPreviewUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
      setMessage("服务器素材配置已清空。");
    } catch (error) {
      setMessage(error instanceof Error ? `清空失败：${error.message}` : "清空失败，请检查服务器数据目录。");
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <section className="border border-line bg-paper p-6 sm:p-8">
        <p className="text-sm font-medium text-clay">SITE ASSETS</p>
        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ink">网站素材管理</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/62">
              正式素材配置保存到服务器 JSON，图片上传到服务器 uploads 目录并生成 /uploads/ 地址。浏览器仅保留同步缓存。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:block">
            <div className="border border-line bg-rice px-4 py-3 text-sm text-ink/62">
              已配置路径：<span className="font-semibold text-ink">{Object.keys(uploadedAssets).length}</span>
              <span className="mx-2 text-ink/30">/</span>
              素材项：<span className="font-semibold text-ink">{assetRows.length}</span>
            </div>
            <button
              type="button"
              onClick={clearAllAssets}
              className="border border-ink px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper lg:mt-3 lg:w-full"
            >
              一键清空本地上传素材
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-ink/62 md:grid-cols-3">
          <div className="border border-line bg-rice p-4">服务器上传：图片写入 uploads 目录并返回稳定的 /uploads/ 地址。</div>
          <div className="border border-line bg-rice p-4">手动 URL：可填写已有图片地址或 /uploads 静态路径。</div>
          <div className="border border-line bg-rice p-4">本地预览：只用于当前浏览器看效果，不会保存为公网图片。</div>
        </div>

        {message ? (
          <div className="mt-5 border border-moss/25 bg-moss/10 px-4 py-3 text-sm text-moss">
            {message}
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-5">
        {assetRows.map((item) => (
          <AssetCard
            key={item.asset.key}
            item={item}
            storedPath={uploadedAssets[item.asset.key] || ""}
            previewUrl={previewUrls[item.asset.key]}
            onPreviewReady={(url) => setPreviewUrl(item.asset.key, url)}
            onMessage={setMessage}
          />
        ))}
      </section>
    </div>
  );
}

function AssetCard({
  item,
  storedPath,
  previewUrl,
  onPreviewReady,
  onMessage
}: {
  item: AssetRow;
  storedPath: string;
  previewUrl?: string;
  onPreviewReady: (url: string) => void;
  onMessage: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [pathValue, setPathValue] = useState(storedPath);
  const [isUploading, setIsUploading] = useState(false);
  const [accessStatus, setAccessStatus] = useState<ImageAccessStatus>("idle");
  const { setAssetPath, removeAsset } = useSiteAssets();
  const savedImageSrc = storedPath || item.asset.src || "";

  useEffect(() => {
    setPathValue(storedPath);
  }, [storedPath]);

  useEffect(() => {
    let cancelled = false;

    if (!savedImageSrc) {
      setAccessStatus("missing");
      return;
    }

    setAccessStatus("checking");
    validateImagePath(savedImageSrc).then((isValid) => {
      if (!cancelled) {
        setAccessStatus(isValid ? "ok" : "error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [savedImageSrc]);

  const savePath = async () => {
    const cleanPath = pathValue.trim();
    if (!cleanPath) {
      onMessage("请先填写图片路径，例如 /uploads/home-hero.jpg。");
      return;
    }

    const isValid = await validateImagePath(cleanPath);
    if (!isValid) {
      onMessage("图片路径无效或图片不存在。");
      return;
    }

    try {
      const result = await setAssetPath(item.asset.key, cleanPath);
      onMessage(result.ok ? `已保存到服务器：${item.name}` : "浏览器缓存写入失败，但服务器数据已保存。");
    } catch (error) {
      onMessage(error instanceof Error ? `保存失败：${error.message}` : "保存失败，请检查服务器数据目录。");
    }
  };

  const removePath = async () => {
    try {
      await removeAsset(item.asset.key);
      setPathValue("");
      onMessage(`已从服务器移除路径：${item.name}`);
    } catch (error) {
      onMessage(error instanceof Error ? `移除失败：${error.message}` : "移除失败，请检查服务器数据目录。");
    }
  };

  const copyRecommendedPath = async () => {
    try {
      await navigator.clipboard.writeText(item.recommendedPath);
      onMessage(`已复制推荐路径：${item.recommendedPath}`);
    } catch {
      setPathValue(item.recommendedPath);
      onMessage("已填入推荐路径，可直接点击保存路径。");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      onMessage("请选择图片类型文件。");
      return;
    }

    const inferredUploadPath = `/uploads/${file.name}`;
    setPathValue(inferredUploadPath);

    if (file.size > maxPreviewInputSize) {
      onMessage(`当前本地预览模式不支持大图，请压缩后再上传或使用 public/uploads 路径方案。已自动填写路径：${inferredUploadPath}`);
      return;
    }

    try {
      const compressedBlob = await compressImageForPreview(file);
      const objectUrl = URL.createObjectURL(compressedBlob);
      onPreviewReady(objectUrl);
      onMessage(
        file.size > warningPreviewInputSize
          ? `图片过大，建议压缩后上传。已生成临时预览，并自动填写路径：${inferredUploadPath}`
          : `已生成本地临时预览，并自动填写路径：${inferredUploadPath}`
      );
    } catch {
      const objectUrl = URL.createObjectURL(file);
      onPreviewReady(objectUrl);
      onMessage(`图片压缩失败，已使用原图临时预览，并自动填写路径：${inferredUploadPath}`);
    }
  };

  const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploading(true);
    onMessage(`正在上传：${item.name}`);

    try {
      const url = await uploadImage(file, {
        scope: "site-assets",
        assetKey: item.asset.key
      });
      const result = await setAssetPath(item.asset.key, url);
      setPathValue(url);
      onPreviewReady("");
      setAccessStatus("ok");
      onMessage(
        result.ok
          ? `上传成功，图片和素材路径均已保存到服务器：${item.name}`
          : "图片已上传到服务器，但浏览器缓存写入失败。"
      );
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "图片上传失败，请稍后重试。");
    } finally {
      setIsUploading(false);
    }
  };

  const status = storedPath
    ? `已配置路径：${storedPath}`
    : item.asset.src
      ? `默认配置：${item.asset.src}`
      : "未配置路径，当前显示默认占位图";
  const accessStatusText: Record<ImageAccessStatus, string> = {
    idle: "未检查",
    checking: "检查中",
    missing: "未配置",
    ok: "可访问",
    error: "路径失效"
  };
  const accessStatusClassName: Record<ImageAccessStatus, string> = {
    idle: "border-line text-ink/54",
    checking: "border-line text-ink/54",
    missing: "border-line text-ink/54",
    ok: "border-moss/35 bg-moss/10 text-moss",
    error: "border-clay/45 bg-clay/10 text-clay"
  };

  return (
    <article className="grid gap-5 border border-line bg-paper p-5 lg:grid-cols-[16rem_1fr]">
      <SiteAssetImage
        asset={item.asset}
        className="aspect-[16/10] border border-line"
        fallbackLabel={item.fallbackLabel}
        variant={item.variant}
        srcOverride={previewUrl}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-clay">ASSET</div>
          <h2 className="mt-2 text-xl font-semibold text-ink">{item.name}</h2>
          <dl className="mt-5 grid gap-3 text-sm">
            <div>
              <dt className="text-ink/42">使用位置</dt>
              <dd className="mt-1 leading-6 text-ink/72">{item.usage}</dd>
            </div>
            <div>
              <dt className="text-ink/42">建议尺寸</dt>
              <dd className="mt-1 leading-6 text-ink/72">{item.size}</dd>
            </div>
            <div>
              <dt className="text-ink/42">当前路径 / 本地上传状态</dt>
              <dd className="mt-1 break-all border border-line bg-rice px-3 py-2 font-mono text-xs text-ink/62">
                {status}
              </dd>
            </div>
            <div>
              <dt className="text-ink/42">图片可访问性</dt>
              <dd className={`mt-1 inline-flex border px-3 py-1 text-xs font-medium ${accessStatusClassName[accessStatus]}`}>
                {accessStatusText[accessStatus]}
              </dd>
            </div>
            <div>
              <dt className="text-ink/42">备注</dt>
              <dd className="mt-1 leading-6 text-ink/62">{item.note}</dd>
            </div>
          </dl>
        </div>

        <div className="grid content-start gap-4 border border-line bg-rice p-4">
          <div>
            <label className="text-xs text-ink/42" htmlFor={`${item.asset.key}-path`}>
              填写图片路径
            </label>
            <input
              id={`${item.asset.key}-path`}
              value={pathValue}
              onChange={(event) => setPathValue(event.target.value)}
              placeholder={item.recommendedPath}
              className="mt-2 h-11 w-full border border-line bg-paper px-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink"
            />
            <div className="mt-2 text-xs leading-5 text-ink/46">推荐文件名：{item.recommendedPath}</div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button type="button" onClick={savePath} className="bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss">
              保存路径
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUploadChange}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => uploadInputRef.current?.click()}
              className="border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "上传中..." : "上传图片"}
            </button>
            <button type="button" onClick={copyRecommendedPath} className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink">
              复制推荐文件名
            </button>
            <button type="button" onClick={removePath} className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink">
              移除图片
            </button>
            <button
              type="button"
              onClick={async () => {
                const targetPath = pathValue.trim() || savedImageSrc;
                if (!targetPath) {
                  setAccessStatus("missing");
                  onMessage("当前素材未配置图片。");
                  return;
                }
                setAccessStatus("checking");
                const isValid = await validateImagePath(targetPath);
                setAccessStatus(isValid ? "ok" : "error");
                onMessage(isValid ? "图片可访问。" : "图片路径无效或图片不存在。");
              }}
              className="border border-line px-4 py-3 text-sm font-medium text-ink/64 transition hover:border-ink hover:text-ink"
            >
              检查图片是否可访问
            </button>
          </div>

          <div className="border-t border-line pt-4">
            <div className="text-xs font-medium text-clay">仅本地临时预览，小图适用</div>
            <p className="mt-2 text-xs leading-5 text-ink/52">
              选择图片后只会生成 object URL 临时预览，不会真正上传到公网。需要公网展示请使用上方“上传图片”。
            </p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 w-full border border-ink px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
            >
              选择本地图片预览
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

async function compressImageForPreview(file: File) {
  const imageBitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxCanvasWidth / imageBitmap.width);
  const width = Math.round(imageBitmap.width * ratio);
  const height = Math.round(imageBitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    imageBitmap.close();
    throw new Error("canvas-unavailable");
  }

  context.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", previewQuality);
  });

  if (blob) {
    return blob;
  }

  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", previewQuality);
  });

  if (!jpegBlob) {
    throw new Error("compression-failed");
  }

  return jpegBlob;
}

function validateImagePath(path: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = `${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}`;
  });
}
