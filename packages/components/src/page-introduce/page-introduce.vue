<template>
  <div class="page-introduce">
    <span class="icon-title">
      <icon-font :icon="icon"></icon-font>
    </span>
    <span class="title">
      <p class="title-black">{{ title }}</p>
      <p class="title-grey">{{ introduce }}</p>
    </span>
  </div>
</template>

<script>
export default {
  name: "PageIntroduce",
  props: {
    icon: String,
    title: String,
    introduce: String
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/src/scss/var.scss";

.page-introduce {
  padding: $paddingContainer $paddingDefault;
  border-bottom: 1px solid $borderColorLight;

  .icon-title {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: #dee7fb;
    margin-right: 16px;
    vertical-align: middle;

    .iconfont {
      width: 24px;
      height: 22px;
      color: $primaryColor;
    }
  }

  .title {
    vertical-align: middle;

    .title-black {
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: bold;
      color: $textColorPrimary;
    }

    .title-grey {
      font-size: 12px;
      color: #6a6c73;
    }
  }
}
</style>
