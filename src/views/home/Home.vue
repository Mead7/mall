<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />
    <!-- 如果使用 probe-type 那么会传递字符串，加上 : 则传递 number -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 为了监听组件的点击必须加上 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { itemListenerMixin, backTopMinxin } from "common/mixin";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMinxin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // 保存 Y 值
    this.saveY = this.$refs.scroll.getScrollY();
    // 取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImageLoad);
  },
  created() {
    // 多做一层封装
    // 1. 请求多个数据
    this.getHomeMultidata();
    // 2. 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    // 3. 赋值
    // this.tabOffsetTop = this.$refs.tabControl;
  },
  mounted() {},
  methods: {
    // 事件监听相关的方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(position) {
      // 判断 BackTop 是否显示
      this.isShowBackTop = -position.y > 1000;
      // 决定 tabControl1 是否吸顶 (position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
      // this.$refs.scroll.scroll.refresh();
    },
    swiperImageLoad() {
      //  获取tabControl2的offsetTop
      // 所有组件都有一个属性 $el 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关的方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1; // 动态地获取地址
      getHomeGoods(type, page).then((res) => {
        res.data && this.goods[type].list.push(...res.data.list); // 特殊语法：对数组解析，然后一个个push进前面的数组
        this.goods[type].page + 1; // 要把原来的数组页面 + 1
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 为了让屏幕滚动时导航栏固定 
  在使用浏览器原生滚动时，为了让导航不跟随一起滚动使用
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  /* height: calc(100% - 93px); */
  /* overflow: hidden; */
  /* margin-top: 44px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
</style>