import { request } from "./request";

export function getDetail(iid) {
    return request({
        url: '/detail',
        params: {
            iid
        }
    })
}

// 商品基本信息
export class Goods {
    constructor(itemInfo, columns, shopInfo) {
        this.title = itemInfo.title;
        this.desc = itemInfo.desc;
        this.newPrice = itemInfo.price;
        this.oldPrice = itemInfo.oldPrice;
        this.realPrice = itemInfo.lowNowPrice;
        this.discount = itemInfo.discountDesc;
        this.columns = columns;
        this.services = shopInfo.services;
    }
}

// 商铺信息
export class Shop {
    constructor(shopInfo) {
        this.shopLogo = shopInfo.shopLogo;
        this.name = shopInfo.name;
        this.cSells = shopInfo.cSells;
        this.cGoods = shopInfo.cGoods;
        this.score = shopInfo.score;
    }
}

// 参数信息
export class GoodsParam {
    constructor(info, rule) {
        // 注：images可能没有值
        this.image = info.images ? info.images[0] : '';
        this.infos = info.set;
        this.sizes = rule.tables;
    }
}

// 请求推荐recommend
export function getRecommend() {
    return request({
        url: '/recommend'
    })
}