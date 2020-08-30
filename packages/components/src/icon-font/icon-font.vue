<template>
  <svg class="iconfont" aria-hidden="true">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script>
export default {
  name: "IconFont",
  props: {
    icon: String
  }
}
</script>
