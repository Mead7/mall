<template>
  <div class="tab-bar-item">
    <div v-show="!isActive" @click="itemClick">
      <slot name="item-icon"></slot>
    </div>
    <div v-show="isActive">
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      // isActive: false,
    };
  },
  computed: {
    isActive() {
      // indexOf() 判断是否包含，如果不包含则 == -1
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      this.$router.push(this.path);
    },
  },
};
</script>

<style>
.tab-bar-item {
  flex: 1;

  text-align: center;

  /* 一般49px是主流的尺寸 */
  height: 49px;

  font-size: 14px;
}

.tab-bar-item img {
  margin-top: 3px;
  margin-bottom: 2px;
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
</style>