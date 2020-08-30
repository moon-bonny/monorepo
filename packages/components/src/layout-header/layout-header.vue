<template>
  <div class="layout-header">
    <!-- 返回按钮 -->
    <icon-font
      v-if="hasBackButton"
      class="back-btn"
      icon="icon_arrow_left"
      @click.native="onBackButton"
    ></icon-font>

    <img class="icon-logo" src="../../../assets/src/images/logo.png" />

    <!-- 标题 -->
    <span>
      <div class="title-content">
        <span class="title ellipsis">{{ title }}</span>
        <icon-font class="title-button" :icon="titleButtonIcon"></icon-font>
        <!-- 如果标题后的图标不是iconfont的图标 -->
        <slot name="titleButton"></slot>
      </div>

      <!-- 描述 -->
      <p class="description ellipsis">{{ description }}</p>
    </span>

    <!-- 右侧按钮 -->
    <div class="header-right">
      <slot name="headerRight"></slot>
    </div>
  </div>
</template>

<script>
import IconFont from "../icon-font/icon-font.vue"

export default {
  name: "LayoutHeader",
  props: {
    hasBackButton: Boolean,
    titleButtonIcon: String, //iconfont图标名字
    title: String,
    description: String,
    backPageRouter: Object
  },
  components: {
    IconFont
  },
  methods: {
    onBackButton() {
      // 返回指定页面
      if (this.backPageRouter) {
        this.$router.push(this.backPageRouter)
        return
      }

      // 返回上一页
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/src/scss/var.scss";

.layout-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid $borderColorLight;

  .back-btn {
    width: 24px;
    height: 24px;
    margin-right: 4px;
    cursor: pointer;
    color: #c6c7ca;
  }

  .icon-logo {
    margin-right: 14px;
    width: 30px;
    height: 30px;
  }

  .title-content {
    display: flex;
    align-items: center;
  }

  .title {
    max-width: 300px;
    margin-bottom: 2px;
    font-size: 18px;
    font-weight: 500;
    color: $textColorPrimary;
  }

  .description {
    font-size: 12px;
    color: $textColorSecondary;
  }

  .title-button {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    vertical-align: middle;
  }

  .header-right {
    // float: right;
    position: absolute;
    right: 16px;
  }
}
</style>
