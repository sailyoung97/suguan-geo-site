export type SiteAsset = {
  key: string;
  src: string;
  alt: string;
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
};

function asset(key: string, alt: string, src = ""): SiteAsset {
  return { key, src, alt };
}

export const siteAssets: SiteAssets = {
  logo: asset("logo", "溯观文化发展有限公司 Logo", "/uploads/logo.jpg"),
  homeHeroImage: asset("homeHeroImage", "溯观官网首页主视觉", "/uploads/home-hero.png"),
  homeHero: asset("homeHeroImage", "溯观官网首页主视觉", "/uploads/home-hero.png"),
  homeHeroWideImage: asset("homeHeroWideImage", "溯观官网首页横向主视觉", "/uploads/home-hero.png"),
  brandAssetsImage: asset("brandAssetsImage", "溯观品牌与项目资产矩阵", "/uploads/brand-assets-matrix.png"),
  aboutHeroImage: asset("aboutHeroImage", "溯观文化产业机构介绍图", "/uploads/about-hero.jpg"),
  aboutHero: asset("aboutHero", "About image"),
  contactQrCode01: asset("contactQrCode01", "溯观公众号二维码", "/uploads/qrcode-official.jpg"),
  contactQrCode02: asset("contactQrCode02", "项目咨询二维码", "/uploads/qrcode-wecom.png"),
  qrcodes: {
    wechatOfficial: asset("qrcode.wechatOfficial", "溯观公众号二维码", "/uploads/qrcode-official.jpg"),
    enterpriseWechat: asset("qrcode.enterpriseWechat", "企业微信二维码", "/uploads/qrcode-wecom.png")
  },
  professionalProof: {
    certificate: asset("professionalProof.certificate", "Professional proof certificate")
  }
};

export const fallbackAsset: SiteAsset = {
  key: "fallback",
  src: "",
  alt: "Image placeholder"
};
