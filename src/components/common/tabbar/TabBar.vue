<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar",
};
</script>

<style>
#tab-bar {
  display: flex;

  background-color: #f6f6f6;

  /* 让.tab-bar浮动于底部 */
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  /* 盒子上方添加阴影效果 */
  box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.2);
}
</style>