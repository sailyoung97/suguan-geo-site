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
  logo: asset("logo", "溯观 Logo"),
  homeHeroImage: asset("homeHeroImage", "溯观首页主视觉图"),
  homeHero: asset("homeHeroImage", "溯观首页主视觉图"),
  homeHeroWideImage: asset("homeHeroWideImage", "首页首屏 SUGUAN 下方超宽底图"),
  brandAssetsImage: asset("brandAssetsImage", "溯观品牌与项目资产矩阵图", "/uploads/brand-assets-matrix.png"),
  aboutHeroImage: asset("aboutHeroImage", "关于溯观首屏图", "/uploads/about-hero.jpg"),
  aboutHero: asset("aboutHero", "溯观团队与项目现场图片"),
  qrcodes: {
    wechatOfficial: asset("qrcode.wechatOfficial", "溯观公众号二维码"),
    enterpriseWechat: asset("qrcode.enterpriseWechat", "溯观企业微信二维码")
  },
  professionalProof: {
    certificate: asset("professionalProof.certificate", "溯观专业背书证书图")
  },
  cases: {
    "kaibu-heritage-park": {
      cover: asset("case-kaibu-cover", "重庆开埠遗址公园案例封面"),
      details: [
        asset("case-kaibu-hero", "重庆开埠遗址公园项目主图"),
        asset("case-kaibu-scene-01", "重庆开埠遗址公园场景图一"),
        asset("case-kaibu-scene-02", "重庆开埠遗址公园场景图二")
      ]
    },
    "shancheng-baba": {
      cover: asset("case.shancheng-baba.cover", "山城巷山城坝坝案例封面"),
      details: [
        asset("case.shancheng-baba.detail.0", "山城巷山城坝坝项目主图"),
        asset("case.shancheng-baba.detail.1", "山城巷山城坝坝场景图一"),
        asset("case.shancheng-baba.detail.2", "山城巷山城坝坝场景图二")
      ]
    },
    "ufx-yaan": {
      cover: asset("case.ufx-yaan.cover", "四川雅安 UFX 飞翔星球大本营案例封面"),
      details: [
        asset("case.ufx-yaan.detail.0", "四川雅安 UFX 飞翔星球大本营项目主图"),
        asset("case.ufx-yaan.detail.1", "四川雅安 UFX 飞翔星球大本营场景图一"),
        asset("case.ufx-yaan.detail.2", "四川雅安 UFX 飞翔星球大本营场景图二")
      ]
    },
    baicaohuxiang: {
      cover: asset("case.baicaohuxiang.cover", "璧山百草湖乡案例封面"),
      details: [
        asset("case.baicaohuxiang.detail.0", "璧山百草湖乡项目主图"),
        asset("case.baicaohuxiang.detail.1", "璧山百草湖乡场景图一"),
        asset("case.baicaohuxiang.detail.2", "璧山百草湖乡场景图二")
      ]
    },
    xiaosangtian: {
      cover: asset("case.xiaosangtian.cover", "西永小桑田亲子农场案例封面"),
      details: [
        asset("case.xiaosangtian.detail.0", "西永小桑田亲子农场项目主图"),
        asset("case.xiaosangtian.detail.1", "西永小桑田亲子农场场景图一"),
        asset("case.xiaosangtian.detail.2", "西永小桑田亲子农场场景图二")
      ]
    }
  }
};

export const fallbackAsset: SiteAsset = {
  key: "fallback",
  src: "",
  alt: "图片占位图"
};
