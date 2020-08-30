<template>
  <!-- 下拉菜单 -->
  <el-dropdown
    v-if="button.type === 'dropdown'"
    class="icon-button-dropdown"
    trigger="click"
    @visible-change="isDropdownMenuShow = $event"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- icon按钮 -->
    <div
      :class="[
        'icon-button-container',
        { active: isDropdownMenuShow },
        { 'no-line': button.noLine }
      ]"
    >
      <el-button class="icon-button">
        <svg
          v-if="button.icon && button.iconType !== 'element'"
          :class="['iconfont', { 'no-text': !button.text }]"
          aria-hidden="true"
        >
          <use :xlink:href="`#${button.icon}`" />
        </svg>
        <i v-else :class="[button.icon, { 'no-text': !button.text }]"></i>
        {{ button.text }}
      </el-button>
    </div>
    <!-- 历史版本列表 -->
    <el-dropdown-menu slot="dropdown" class="icon-button-dropdown-menu">
      <!-- 加载中 -->
      <div v-if="button.loading" class="loading-container">
        <i class="el-icon-loading"></i>
      </div>
      <!-- 历史列表每一项 -->
      <el-dropdown-item
        v-for="item in dropdownListMapped"
        v-else-if="dropdownListMapped.length"
        :key="item.version"
        :command="item"
      >
        <div class="menu-item">
          <div :class="{ active: activeDropdownItem === item.version }">
            {{ item.version }}
          </div>
          <div class="version-time">{{ item.createdTime | timeFormat }}</div>
        </div>
      </el-dropdown-item>
      <div v-else class="no-data">暂无数据</div>
    </el-dropdown-menu>
  </el-dropdown>

  <!-- 普通带文字按钮 -->
  <div v-else :class="['icon-button-container', { 'no-line': button.noLine }]">
    <el-button
      class="icon-button"
      :loading="button.loading"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <svg
        v-if="button.icon && button.iconType !== 'element' && !button.loading"
        :class="['iconfont', { 'no-text': !button.text }]"
        aria-hidden="true"
      >
        <use :xlink:href="`#${button.icon}`" />
      </svg>
      <i v-else-if="button.icon && !button.loading" :class="button.icon"></i>
      {{ button.text }}
    </el-button>
  </div>
</template>

<script>
import { formatDate } from "@/utils/utils"

export default {
  name: "IconButton",
  props: {
    button: {
      type: Object,
      default: () => ({
        type: "", // 按钮类型 默认为普通按钮, 'primary' - 蓝色背景按钮, 'dropdown' - 带下拉列表的按钮
        iconType: "iconfont",
        icon: "",
        text: "",
        loading: false,
        noLine: false
      })
    },
    // 下拉菜单列表
    dropdownList: {
      type: Array,
      default: () => []
    },
    // 当前高亮的菜单item
    activeDropdownItem: {
      type: String,
      default: ""
    },
    // 下拉列表字段映射
    dropdownMaps: {
      type: Object,
      default: () => null
    }
  },
  filters: {
    /*
      @func timeFormat
      @desc 时间格式化
      @params {int|string} timestamp 时间戳
    */
    timeFormat: function(timestamp) {
      return formatDate(+timestamp, "YYYY-MM-DD")
    }
  },
  data() {
    return {
      // 菜单是否显示
      isDropdownMenuShow: false,
      dropdownListMapped: []
    }
  },
  watch: {
    dropdownList() {
      this.dropdownListMapped = []
      this.mapDropdown()
    }
  },
  created() {},
  methods: {
    /**
     * @func
     * @desc 下拉列表字段映射
     */
    mapDropdown() {
      if (!this.dropdownMaps) {
        this.dropdownListMapped = this.dropdownList
        return
      }

      const maps = this.dropdownMaps
      Object.keys(maps).forEach(key => {
        const mapKey = maps[key]
        this.dropdownList.forEach(item => {
          let dropdown = { ...item }
          dropdown[key] = dropdown[mapKey]
          this.dropdownListMapped.push(dropdown)
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/src/scss/var.scss";

.icon-button {
  .no-text {
    margin-right: 0;
  }
  &-container {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    & + &,
    & + .icon-button-dropdown {
      &.no-line {
        margin-left: 24px;
      }
      &:not(.no-line)::before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 12px;
        margin: 0 24px;
        background-color: #dcdee6;
      }
    }
    & + .icon-button-dropdown:not(.no-line) {
      &::before {
        margin-right: 20px;
      }
    }
  }
  &.el-button {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: #313137;
    > span {
      display: flex;
      align-items: center;
    }
    .iconfont {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      &.no-text {
        @extend .no-text;
      }
    }
    i {
      font-size: 16px;
      margin-right: 6px;
      &.no-text {
        @extend .no-text;
      }
    }
    &:hover {
      color: $primaryColor;
    }
    &.el-button--primary {
      padding: 8px 16px;
      line-height: 20px;
      color: #fff;
      background-color: $primaryColor;
      &:hover {
        background-color: #5080e6;
      }
      &:active {
        background-color: #2056ca;
      }
    }
  }
  &-dropdown {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    .icon-button-container {
      padding: 4px;
      border-radius: 2px;
      cursor: pointer;
      &.active {
        .icon-button {
          color: $primaryColor;
        }
        background-color: #e4e8f3;
      }
    }
    & + .icon-button-container {
      &.no-line {
        margin-left: 24px;
      }
      &:not(.no-line)::before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 12px;
        margin: 0 24px 0 20px;
        background-color: #dcdee6;
      }
    }
  }
  &-dropdown-menu.el-dropdown-menu {
    max-height: 300px;
    padding: 8px 0;
    border: 0;
    overflow: auto;
    box-shadow: 0px 2px 8px 0px rgba(45, 48, 59, 0.1);
    .el-dropdown-menu__item {
      padding: 0;
    }
    &.el-popper {
      &[x-placement^="bottom"] {
        margin-top: 4px;
      }
      &[x-placement^="right"] {
        margin-left: 4px;
      }
      .popper__arrow {
        display: none;
      }
    }
    .menu-item {
      min-width: 160px;
      padding: 6px 16px;
      line-height: 20px;
      font-size: 14px;
      color: $textColorPrimary;
      &:hover {
        background-color: #f5f6f9;
      }
      .active {
        font-weight: 500;
        color: $primaryColor;
      }
    }
    .version-time {
      font-size: 12px;
      opacity: 0.5;
      transform: scale(0.83);
      transform-origin: left;
    }
    .loading-container {
      width: 160px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: $textColorPrimary;
    }
    .no-data {
      @extend .loading-container;
      font-size: 12px;
    }
  }
}
</style>
