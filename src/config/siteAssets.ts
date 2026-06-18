export type SiteAsset = {
  key: string;
  src: string;
  alt: string;
};

type CaseAssetGroup = {
  cover: SiteAsset;
  details: SiteAsset[];
};

type SiteAssets = {
  logo: SiteAsset;
  homeHeroImage: SiteAsset;
  homeHero: SiteAsset;
  homeHeroWideImage: SiteAsset;
  brandAssetsImage: SiteAsset;
  aboutHeroImage: SiteAsset;
  aboutHero: SiteAsset;
  contactQrCode01: SiteAsset;
  contactQrCode02: SiteAsset;
  qrcodes: {
    wechatOfficial: SiteAsset;
    enterpriseWechat: SiteAsset;
  };
  professionalProof: {
    certificate: SiteAsset;
  };
  cases: Record<string, CaseAssetGroup>;
};

function asset(key: string, alt: string, src = ""): SiteAsset {
  return { key, src, alt };
}

export const siteAssets: SiteAssets = {
  logo: asset("logo", "Suguan logo", "/uploads/logo.jpg"),
  homeHeroImage: asset("homeHeroImage", "Homepage hero image", "/uploads/home-hero.png"),
  homeHero: asset("homeHeroImage", "Homepage hero image", "/uploads/home-hero.png"),
  homeHeroWideImage: asset("homeHeroWideImage", "Homepage wide hero image", "/uploads/home-hero.png"),
  brandAssetsImage: asset("brandAssetsImage", "Brand assets matrix", "/uploads/brand-assets-matrix.png"),
  aboutHeroImage: asset("aboutHeroImage", "About hero image", "/uploads/about-hero.jpg"),
  aboutHero: asset("aboutHero", "About image"),
  contactQrCode01: asset("contactQrCode01", "Official account QR code"),
  contactQrCode02: asset("contactQrCode02", "Project consultation QR code"),
  qrcodes: {
    wechatOfficial: asset("qrcode.wechatOfficial", "Official account QR code"),
    enterpriseWechat: asset("qrcode.enterpriseWechat", "Enterprise WeChat QR code")
  },
  professionalProof: {
    certificate: asset("professionalProof.certificate", "Professional proof certificate")
  },
  cases: {
    "kaibu-heritage-park": {
      cover: asset("case-kaibu-cover", "Kaibu Heritage Park case cover"),
      details: [
        asset("case-kaibu-hero", "Kaibu Heritage Park hero image"),
        asset("case-kaibu-scene-01", "Kaibu Heritage Park scene image 01"),
        asset("case-kaibu-scene-02", "Kaibu Heritage Park scene image 02")
      ]
    },
    "shancheng-baba": {
      cover: asset("case.shancheng-baba.cover", "Shancheng Baba case cover"),
      details: [
        asset("case.shancheng-baba.detail.0", "Shancheng Baba detail image 01"),
        asset("case.shancheng-baba.detail.1", "Shancheng Baba detail image 02"),
        asset("case.shancheng-baba.detail.2", "Shancheng Baba detail image 03")
      ]
    },
    "ufx-yaan": {
      cover: asset("case.ufx-yaan.cover", "UFX Yaan case cover"),
      details: [
        asset("case.ufx-yaan.detail.0", "UFX Yaan detail image 01"),
        asset("case.ufx-yaan.detail.1", "UFX Yaan detail image 02"),
        asset("case.ufx-yaan.detail.2", "UFX Yaan detail image 03")
      ]
    },
    baicaohuxiang: {
      cover: asset("case.baicaohuxiang.cover", "Baicaohuxiang case cover"),
      details: [
        asset("case.baicaohuxiang.detail.0", "Baicaohuxiang detail image 01"),
        asset("case.baicaohuxiang.detail.1", "Baicaohuxiang detail image 02"),
        asset("case.baicaohuxiang.detail.2", "Baicaohuxiang detail image 03")
      ]
    },
    xiaosangtian: {
      cover: asset("case.xiaosangtian.cover", "Xiaosangtian case cover"),
      details: [
        asset("case.xiaosangtian.detail.0", "Xiaosangtian detail image 01"),
        asset("case.xiaosangtian.detail.1", "Xiaosangtian detail image 02"),
        asset("case.xiaosangtian.detail.2", "Xiaosangtian detail image 03")
      ]
    }
  }
};

export const fallbackAsset: SiteAsset = {
  key: "fallback",
  src: "",
  alt: "Image placeholder"
};
