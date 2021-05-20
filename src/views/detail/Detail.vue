<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <!-- 为了监听组件的点击必须加上 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMinxin } from "common/mixin";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    DetailBottomBar,
  },
  mixins: [itemListenerMixin, backTopMinxin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
    };
  },
  created() {
    // 1. 保存传入的id
    this.iid = this.$route.params.iid;
    // 2. 根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 2.1 把数据保存为data
      const data = res.result;
      // 2.2 获取顶部的图片
      this.topImages = res.result.itemInfo.topImages;
      // 2.3 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo);
      // 2.4 获取店铺信息
      this.shop = new Shop(data.shopInfo);
      // 2.5 获取商品详情信息
      this.detailInfo = data.detailInfo;
      // 2.6 获取商品参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 2.7 取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    // 3. 请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
    // 4. 给 getthemeTopY 赋值（进行防抖）
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
    }, 100);
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImageLoad);
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 200);
    },
    contentScroll(position) {
      // 获取 Y 值
      const positionY = -position.y;
      // let length = this.themeTopYs.length;
      for (let i in this.themeTopYs) {
        i = parseInt(i);
        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }

        // hack 做法（简化判断逻辑）
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 是否显示回到底部
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart() {
      // 1. 获取购物车所需要的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // 2. 将商品添加到购物车当中
      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });
      this.addCart(product).then((res) => {
        this.$toast.show(res, 2000);
      });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>
