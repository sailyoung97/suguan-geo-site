"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SiteAssetImage } from "@/components/SiteAssetImage";
import type { SiteAsset } from "@/src/config/siteAssets";
import { siteAssets } from "@/src/config/siteAssets";
import { useSiteAssets } from "@/src/hooks/useSiteAssets";
import { uploadImageToBlob } from "@/src/lib/uploadImage";

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

const caseDetailRows: AssetRow[] = [
  {
    title: "重庆开埠遗址公园",
    key: "kaibu-heritage-park",
    filePrefix: "case-kaibu",
    fallbackLabel: "Case Detail 01"
  },
  {
    title: "山城坝坝",
    key: "shancheng-baba",
    filePrefix: "case-shancheng-baba",
    fallbackLabel: "Case Detail 02"
  },
  {
    title: "UFX 飞翔星球大本营",
    key: "ufx-yaan",
    filePrefix: "case-ufx",
    fallbackLabel: "Case Detail 03"
  },
  {
    title: "璧山百草湖乡",
    key: "baicaohuxiang",
    filePrefix: "case-baicaohuxiang",
    fallbackLabel: "Case Detail 04"
  },
  {
    title: "小桑田亲子农场",
    key: "xiaosangtian",
    filePrefix: "case-xiaosangtian",
    fallbackLabel: "Case Detail 05"
  }
].flatMap((item) => {
  const details = siteAssets.cases[item.key].details;
  const labels = ["详情主图", "场景图 1", "场景图 2"];
  const fileNames = ["hero", "scene-01", "scene-02"];

  return details.map((asset, index) => ({
    name: `${item.title}${labels[index]}`,
    usage: `项目案例详情页 / ${item.title} / ${labels[index]}`,
    asset,
    size: index === 0 ? "1920 x 960px，适配详情页顶部宽图" : "1600 x 900px，16:9",
    note: index === 0 ? "详情页顶部大图；未配置时会自动使用该案例封面图。" : "详情页场景补充图；未配置时会自动使用该案例封面图。",
    fallbackLabel: `${item.fallbackLabel}-${index + 1}`,
    recommendedPath: `/uploads/${item.filePrefix}-${fileNames[index]}.jpg`
  }));
});

const assetRows: AssetRow[] = [
  {
    name: "Logo",
    usage: "前台官网顶部导航 / 品牌识别",
    asset: siteAssets.logo,
    size: "建议 SVG 或 512 x 512px 透明 PNG",
    note: "用于全站品牌露出，深浅底色下都需保持清晰。",
    fallbackLabel: "观",
    recommendedPath: "/uploads/logo.png",
    variant: "mark"
  },
  {
    name: "首页主视觉图",
    usage: "首页首屏右侧主视觉区域",
    asset: siteAssets.homeHeroImage,
    size: "1920 x 1400px 或更高，适配裁切",
    note: "大图建议放入 public/uploads 后填写路径，不建议使用本地临时预览。",
    fallbackLabel: "Home Hero Image",
    recommendedPath: "/uploads/home-hero.jpg"
  },
  {
    name: "首页首屏超宽底图",
    usage: "首页首屏 / SUGUAN 英文字下方",
    asset: siteAssets.homeHeroWideImage,
    size: "1920 x 700px 或更宽的横图",
    note: "用于首页首屏超大 SUGUAN 字下方的横向品牌视觉底图，建议使用超宽横图并放入 public/uploads 后填写路径。",
    fallbackLabel: "首页首屏超宽底图待上传",
    recommendedPath: "/uploads/home-hero-wide.jpg"
  },
  {
    name: "品牌资产矩阵图",
    usage: "首页第二屏「品牌与项目资产」模块",
    asset: siteAssets.brandAssetsImage,
    size: "1920 x 1080px 或 1920 x 1200px",
    note: "由平面设计同事制作整张 Logo / 品牌资产矩阵大图，放入 public/uploads 后填写路径即可。",
    fallbackLabel: "品牌资产矩阵图待上传",
    recommendedPath: "/uploads/brand-assets-matrix.jpg"
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
    name: "重庆开埠遗址公园案例封面",
    usage: "项目案例列表 / 开埠遗址公园详情入口",
    asset: siteAssets.cases["kaibu-heritage-park"].cover,
    size: "1600 x 1000px，16:10",
    note: "建议使用开埠文化、历史遗址、滨江公共空间或城市文化场景。",
    fallbackLabel: "Case Cover 01",
    recommendedPath: "/uploads/case-kaibu-cover.jpg"
  },
  {
    name: "山城坝坝案例封面",
    usage: "项目案例列表 / 山城坝坝详情入口",
    asset: siteAssets.cases["shancheng-baba"].cover,
    size: "1600 x 1000px，16:10",
    note: "建议使用山城巷街巷、坝坝生活或公共空间场景。",
    fallbackLabel: "Case Cover 02",
    recommendedPath: "/uploads/case-shancheng-baba-cover.jpg"
  },
  {
    name: "UFX 飞翔星球大本营案例封面",
    usage: "项目案例列表 / UFX 详情入口",
    asset: siteAssets.cases["ufx-yaan"].cover,
    size: "1600 x 1000px，16:10",
    note: "建议使用无人机培训、研学营地或户外飞行主题画面。",
    fallbackLabel: "Case Cover 03",
    recommendedPath: "/uploads/case-ufx-cover.jpg"
  },
  {
    name: "璧山百草湖乡案例封面",
    usage: "项目案例列表 / 百草湖乡详情入口",
    asset: siteAssets.cases.baicaohuxiang.cover,
    size: "1600 x 1000px，16:10",
    note: "建议使用乡村生态、农文旅体验或湖乡空间节点。",
    fallbackLabel: "Case Cover 04",
    recommendedPath: "/uploads/case-baicaohuxiang-cover.jpg"
  },
  {
    name: "小桑田亲子农场案例封面",
    usage: "项目案例列表 / 小桑田详情入口",
    asset: siteAssets.cases.xiaosangtian.cover,
    size: "1600 x 1000px，16:10",
    note: "建议使用亲子活动、自然教育或农场运营场景。",
    fallbackLabel: "Case Cover 05",
    recommendedPath: "/uploads/case-xiaosangtian-cover.jpg"
  },
  ...caseDetailRows,
  {
    name: "公众号二维码",
    usage: "联系我们页面 / 扫码联系区",
    asset: siteAssets.qrcodes.wechatOfficial,
    size: "800 x 800px，正方形",
    note: "替换为正式公众号二维码后，建议保留足够白边。",
    fallbackLabel: "QR",
    recommendedPath: "/uploads/qrcode-official.png",
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

  const clearAllAssets = () => {
    const result = clearAssets();
    setPreviewUrls((current) => {
      Object.values(current).forEach((url) => URL.revokeObjectURL(url));
      return {};
    });
    setMessage(
      result.ok
        ? "已清空本地上传素材配置。"
        : "本地存储空间不足，请压缩图片或清理已上传素材。"
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <section className="border border-line bg-paper p-6 sm:p-8">
        <p className="text-sm font-medium text-clay">SITE ASSETS</p>
        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ink">网站素材管理</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/62">
              线上展示建议直接上传到 Vercel Blob，上传成功后会自动保存公网图片 URL。
              也可以手动填写图片 URL 或 <span className="font-mono text-ink">/uploads/文件名</span> 做临时调试。
              本地预览仅在当前浏览器临时显示，不会把大图 base64 写入 localStorage。
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
          <div className="border border-line bg-rice p-4">正式上传：图片存入 Vercel Blob，前台读取公网 URL。</div>
          <div className="border border-line bg-rice p-4">手动 URL：仍可填写 /uploads/文件名或完整图片地址。</div>
          <div className="border border-line bg-rice p-4">本地预览：仅小图适用，不保存 base64，不作为线上图片。</div>
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

    const result = setAssetPath(item.asset.key, cleanPath);
    onMessage(
      result.ok
        ? `已保存路径：${item.name}`
        : result.error === "invalid-path"
          ? "请填写有效图片路径，例如 /uploads/home-hero.jpg。"
          : "本地存储空间不足，请压缩图片或清理已上传素材。"
    );
  };

  const removePath = () => {
    const result = removeAsset(item.asset.key);
    setPathValue("");
    onMessage(
      result.ok
        ? `已移除路径：${item.name}`
        : "本地存储空间不足，请压缩图片或清理已上传素材。"
    );
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

  const handleBlobUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploading(true);
    onMessage(`正在上传：${item.name}`);

    try {
      const url = await uploadImageToBlob(file, {
        scope: "site-assets",
        assetKey: item.asset.key
      });
      if (!url || url.startsWith("blob:") || url.startsWith("data:")) {
        throw new Error("上传未返回有效公网图片 URL。");
      }
      const result = setAssetPath(item.asset.key, url);
      setPathValue(url);
      onPreviewReady("");
      onMessage(
        result.ok
          ? `上传成功，已保存公网 URL：${item.name}`
          : "图片已上传，但本地保存失败，请复制返回 URL 后重试。"
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
            <div className="text-xs font-medium text-clay">上传到 Vercel Blob</div>
            <p className="mt-2 text-xs leading-5 text-ink/52">
              支持 jpg、jpeg、png、webp，单张不超过 10MB。上传成功后自动写入公网 URL，并同步前台显示。
            </p>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleBlobUploadChange}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => uploadInputRef.current?.click()}
              className="mt-3 w-full border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "上传中..." : "上传图片"}
            </button>
          </div>

          <div className="border-t border-line pt-4">
            <div className="text-xs font-medium text-clay">仅本地临时预览，小图适用</div>
            <p className="mt-2 text-xs leading-5 text-ink/52">
              选择图片后会压缩为 webp/jpeg、最大宽度 1600px、质量 0.75，并使用 object URL 临时预览，不写入 localStorage。
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
