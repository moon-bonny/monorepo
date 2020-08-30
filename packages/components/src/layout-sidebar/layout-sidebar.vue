<template>
  <div class="layout-sidebar">
    <!-- 顶部 -->
    <div class="layout-sidebar-top">
      <!-- 标题 -->
      <p class="layout-sidebar-title" v-if="title">{{ title }}</p>

      <!-- 搜索按钮 -->
      <span class="search-button" v-if="hasSearch" @click="onSearchButton">
        <span v-if="isShowSearch" class="search-button-txt">关闭搜索</span>
        <icon-font v-else icon="icon_search"></icon-font>
      </span>

      <!-- 添加按钮和搜索框 -->
      <div
        class="layout-sidebar-top-content"
        v-if="hasOperation || isShowSearch"
      >
        <!-- v-if="hasOperation" -->
        <div class="create-button" v-show="!isShowSearch" @click="onCreate">
          + {{ createButton.text }}
        </div>
        <transition name="el-zoom-in-bottom">
          <el-input
            v-show="isShowSearch"
            v-model="searchKey"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            size="small"
            @blur="onSearchInputBlur"
            @change="onSearchInputChange"
          ></el-input>
        </transition>
      </div>
    </div>

    <!-- 列表 -->
    <div v-loading="sidebarLoading">
      <el-menu
        :default-active="defaultActiveIndex"
        @select="onSelect"
        v-if="sidebarList.length"
      >
        <el-menu-item
          v-for="item in sidebarList"
          :key="item.id"
          :index="item.id"
          class="layout-sidebar-menu-item"
          style="padding: 10px 16px 10px 48px;"
        >
          <icon-font
            class="menu-item-icon"
            :icon="sidebarConfig.icon"
          ></icon-font>
          <el-tooltip
            :offset="15"
            effect="dark"
            :content="item.name"
            placement="top-start"
          >
            <p class="black-txt ellipsis">{{ item.name }}</p>
          </el-tooltip>
          <p class="grey-txt ellipsis">{{ item.description }}</p>

          <!-- 编辑删除按钮 -->
          <template v-if="hasOperation">
            <el-dropdown
              class="sidebar-dropdown"
              v-show="!isShowSearch"
              placement="bottom"
            >
              <span class="sidebar-dropdown-icon">
                <icon-font icon="icon_more"></icon-font>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(button, i) of extraButtons"
                  :key="i"
                  @click.native="onExtraButtons(button, item)"
                  >{{ button.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-menu-item>
      </el-menu>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
import IconFont from "../icon-font/icon-font.vue"

export default {
  name: "LayoutSidebar",
  props: {
    // 查看历史版本时传版本号
    version: {
      type: String,
      default: ""
    },
    // 是否有增删改操作
    hasOperation: {
      type: Boolean,
      default: true
    },
    // 是否有搜索按钮
    hasSearch: {
      type: Boolean,
      default: true
    },
    createButton: Object, // 添加按钮 属性:text - 按钮文案,
    sidebarConfig: Object, // columnMaps - 字段映射, icon - iconfont的id
    url: String, // 获取数据接口路径
    urlDelete: Function, // 删除请求路径
    title: String //sidebar标题
  },
  components: {
    IconFont
  },
  data() {
    return {
      sidebarList: [],
      classifyMenuData: [],
      extraButtons: [
        {
          icon: "icon_edit",
          type: "edit",
          name: "编辑"
        },
        {
          icon: "icon_delete_fill",
          type: "delete",
          name: "删除"
        }
      ],
      defaultActiveIndex: "",
      searchKey: "",
      serviceVersion: this.$route.query.version || "", // 查看历史版本,
      isShowSearch: false,
      sidebarLoading: false,
      sidebarColumnMaps: {
        name: "name",
        description: "description"
      }
    }
  },
  created() {
    this.loadSidebar()
    if (this.serviceVersion) {
      this.isShowSearch = true
    }
  },
  methods: {
    /**
     * @func
     * @desc 获取sidebar数据
     */
    loadSidebar(isSearch) {
      this.sidebarLoading = true
      let params = {
        serviceVersion: this.version
      }
      isSearch &&
        Object.assign(params, {
          keyword: this.searchKey
        })

      this.$axios
        .get(this.url, { params })
        .then(({ payload }) => {
          let data = payload.length ? payload : []
          this.sidebarList = data
          this.classifyMenuData = data

          this.$nextTick(() => {
            this.defaultActiveIndex = data.length ? data[0].id : ""
          })

          this.$emit("loaded-sidebar", data)
          this.$emit("get-sidebar-id", data.length ? data[0].id : "")
        })
        .finally(() => {
          this.sidebarLoading = false
        })
    },

    /**
     * @func
     * @desc sidebar项选择
     * @param {string} sidebarId 菜单id
     */
    onSelect(sidebarId) {
      this.defaultActiveIndex = sidebarId
      this.$emit("get-sidebar-id", sidebarId)
    },

    /**
     * @func
     * @desc 添加sidebar项
     */
    onCreate() {
      this.$emit("create")
    },

    /**
     * @func
     * @desc sidebar按钮事件
     * @param {object} button 按钮对象
     */
    onExtraButtons(button, sidebarItem) {
      switch (button.type) {
        case "edit":
          this.onEdit(sidebarItem)
          break
        case "delete":
          this.onDelete(sidebarItem)
          break
      }
    },

    /**
     * @func
     * @desc 编辑sidebar项
     * @param {object} item sidebar项数据
     */
    onEdit(item) {
      this.$emit("edit", item)
    },

    /**
     * @func
     * @desc 删除sidebar项
     * @param {object} item sidebar项数据
     */
    async onDelete(item) {
      await this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })

      await this.$axios.delete(this.urlDelete(item))
      this.$message("删除成功")
      this.loadSidebar()
    },

    /**
     * @func
     * @desc 搜索按钮点击事件
     */
    onSearchButton() {
      this.isShowSearch = !this.isShowSearch
    },

    /**
     * @func
     * @desc 搜索输入框change事件
     */
    onSearchInputChange() {
      this.loadSidebar(true)
    },

    /**
     * @func
     * @desc 搜索框失焦事件
     */
    onSearchInputBlur() {
      // 隐藏or显示搜索按钮
      // this.isShowSearch = this.serviceVersion ? true : false
      this.isShowSearch = false
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/src/scss/var.scss";

@mixin iconEdit {
  width: 16px;
  height: 16px;
  color: $textColorSecondary;
}
.layout-sidebar {
  position: relative;
  width: 240px;
  height: 100%;
  overflow: auto;
  border-right: 1px solid $borderColorLight;

  // 标题
  &-title {
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    // margin-bottom: 15px;
  }

  // 顶部按钮
  &-top {
    position: relative;
    margin-bottom: 15px;
    padding: 15px 0;
    border-bottom: 1px solid $borderColorLight;

    &-content {
      // display: flex;
      // flex-wrap: nowrap;
      height: 36px;
      padding: 0 14px;
      margin-top: 15px;
      overflow: hidden;
    }

    .search-button {
      position: absolute;
      right: 16px;
      top: 16px;
      display: inline-flex;
      height: 16px;
      align-items: center;
      cursor: pointer;
      // line-height: 16px;

      &-txt {
        color: $primaryColor;
        font-size: 12px;
      }

      .iconfont {
        width: 16px;
        height: 100%;
        color: $textColorPlaceholder;
      }
    }

    .create-button {
      height: 100%;
      border: 1px dashed $borderColorLight;
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }

  // sidebar项
  &.el-menu {
    border: none;
  }

  .el-menu {
    width: 100%;
  }

  .el-menu-item {
    position: relative;

    &.is-active {
      p {
        color: $primaryColor;
      }

      .iconfont {
        @extend p;
      }
    }
    .menu-item-icon {
      position: absolute;
      left: 16px;
      width: 24px;
      height: 24px;
      color: $textColorSecondary;
    }
  }

  // 下拉菜单
  .sidebar-dropdown {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translate(0, -50%);
    width: 16px;
    height: 16px;
    &-icon,
    .iconfont {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../assets/src/scss/var.scss";

//搜索框
.layout-sidebar-search {
  position: absolute;
  width: 88%;
}

// sidebar标题描述字体
.black-txt {
  width: 166px;
  font-size: 14px;
  margin-bottom: 6px;
  font-weight: 400;
}

.grey-txt {
  width: 160px;
  font-size: 12px;
  color: $textColorSecondary;
}

.no-data {
  text-align: center;
  color: $textColorSecondary;
  margin-top: 100px;
}
</style>
