export interface AffiliateItem {
  slug: string;
  name: string;
  targetUrl: string;
  redirectPath: string;
}

export const AFFILIATE_LINKS: Record<string, AffiliateItem> = {
  shenxing: {
    slug: 'shenxing',
    name: '神行加速',
    targetUrl: 'https://wuhan01.shenxingaff.com/#/?code=WUQMrgI8',
    redirectPath: '/go/shenxing',
  },
  dalaoyun: {
    slug: 'dalaoyun',
    name: '大佬云',
    targetUrl: 'https://fugui0077.dalaoyunaff.com/#/?code=Wpfk4XD5',
    redirectPath: '/go/dalaoyun',
  },
  shandianshu: {
    slug: 'shandianshu',
    name: '闪电鼠',
    targetUrl: 'https://fugui0077.shandianshuaff.com/#/?code=KSByEAn9',
    redirectPath: '/go/shandianshu',
  },
  liulianyun: {
    slug: 'liulianyun',
    name: '榴莲云',
    targetUrl: 'https://zyrrz.liulianyunaff.com/#/?code=Y6A1M1MN',
    redirectPath: '/go/liulianyun',
  },
  huanqiuti: {
    slug: 'huanqiuti',
    name: '环球梯',
    targetUrl: 'https://fugui0077.huanqiutiaff.com/#/?code=rJyQn4xG',
    redirectPath: '/go/huanqiuti',
  },
  yunjiexian: {
    slug: 'yunjiexian',
    name: '云界线',
    targetUrl: 'https://fugui0077.yunjiexianaff.com/#/?code=FVkiFyAx',
    redirectPath: '/go/yunjiexian',
  },
  guangshuyun: {
    slug: 'guangshuyun',
    name: '光速云',
    targetUrl: 'https://j98j.gsyvipaff.com/#/?code=9506F5Sq',
    redirectPath: '/go/guangshuyun',
  },
};
