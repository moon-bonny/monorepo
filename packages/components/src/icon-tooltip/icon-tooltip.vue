<template>
  <div class="icon-tooltip">
    <el-tooltip v-bind="$attrs">
      <svg class="iconfont" aria-hidden="true">
        <use :xlink:href="`#${icon}`"></use>
      </svg>
      <!-- content值不存在时使用插槽 -->
      <div v-if="!$attrs.content" slot="content">
        <slot></slot>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "IconTooltip",
  props: {
    icon: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-tooltip {
  display: flex;
  align-items: center;
  .iconfont {
    width: 16px;
    height: 16px;
  }
}
</style>
