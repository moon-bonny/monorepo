<template>
  <div class="v-table-wrapper">
    <div class="v-table-top">
      <!-- 创建按钮 -->
      <el-button
        v-if="tableConfig.hasCreate"
        type="primary"
        class="v-table-create-btn"
        v-bind="tableConfig.createButton && tableConfig.createButton.attrs"
        @click="onCreate"
      >
        +
        {{ tableConfig.createButton && tableConfig.createButton.text }}
      </el-button>

      <!-- 搜索 -->
      <el-input
        v-if="tableConfig.hasSearch"
        class="v-table-search-input"
        size="medium"
        clearable
        v-model="searchValue"
        :placeholder="tableConfig.searchInput.placeholder || '请输入'"
        @change="onSearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="clr"></div>
    </div>

    <!-- 表格 -->
    <el-table
      class="v-table"
      :data="currentTableData"
      v-bind="tableConfig.table"
      @cell-click="onCellClick"
    >
      <el-table-column
        v-for="(column, index) in tableConfig.columns"
        :key="index"
        v-bind="column"
      ></el-table-column>

      <!-- 自定义样式列 -->
      <slot name="tableColumn"></slot>

      <!-- 操作按钮遵循不出现三个文案按钮原则 -->
      <el-table-column
        label="操作"
        :width="tableConfig.operationWidth || operationWidth"
        fixed="right"
        v-if="
          tableConfig.extraButtons ||
            tableConfig.hasEdit ||
            tableConfig.hasDelete
        "
      >
        <template slot-scope="scope">
          <!-- 自定义按钮 -->
          <div class="operate-buttons-container">
            <el-button
              type="text"
              v-for="(button, buttonIndex) in tableConfig.extraButtons.slice(
                0,
                2
              )"
              :key="buttonIndex"
              v-show="(button.show && button.show(scope.row)) || !button.show"
              v-bind="button.attrs"
              @click="onOperation(scope.row, button)"
              >{{ button.text }}</el-button
            >

            <!-- 按钮数量少于3时, 编辑、删除按钮平铺 -->
            <template v-if="buttonsNum < 3">
              <el-button
                type="text"
                v-if="tableConfig.hasEdit"
                @click="onEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="deleteButton"
                v-if="tableConfig.hasDelete"
                @click="onDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>

            <!-- 按钮数量大于等于3时, 多出的按钮以菜单形式展示 -->
            <el-dropdown
              v-else
              placement="bottom"
              trigger="click"
              @command="onCommand"
            >
              <div class="more-button">
                <icon-font icon="icon_more"></icon-font>
              </div>
              <el-dropdown-menu
                class="more-button-dropdown-menu"
                slot="dropdown"
              >
                <el-dropdown-item
                  v-for="(button,
                  buttonIndex) in tableConfig.extraButtons.slice(2)"
                  :key="buttonIndex"
                  :command="{ event: 'onOperation', args: [scope.row, button] }"
                  >{{ button.text }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="tableConfig.hasEdit"
                  :command="{ event: 'onEdit', args: [scope.row] }"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="tableConfig.hasDelete"
                  :command="{
                    event: 'onDelete',
                    args: [scope.$index, scope.row]
                  }"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-if="tableConfig.hasPage"
      class="v-table-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
      :page-sizes="[10]"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="onCurrentPageChange"
    >
      <!-- :current-page="currentPage4" -->
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
    </el-pagination>
  </div>
</template>

<script>
import { isFunction } from "util"
// import { splitUrl } from "@/utils/utils"

export default {
  name: "VTable",
  props: {
    // 表格配置, 属性如下
    /*
     * tableData - Array, 表格数据, 跟url/urlDelete二选一
     * hasSearch - Boolean, 默认不展示搜索
     * searchInput - Object, 搜索输入框
     * searchInput.placeholder - String, 搜索输入框placeholder, 默认'请输入'
     * hasCreate - Boolean, 默认不展示创建按钮
     * hasEdit - Boolean, 默认不展示编辑按钮
     * hasDelete - Boolean, 默认不展示删除按钮
     * hasPage - Boolean, 默认不展示分页器
     * operationWidth - String, 操作列宽度
     * createButton - Object, 创建按钮
     * createButton.text - String, 创建按钮文案
     * createButton.attrs - Object, 创建按钮的element ui属性
     * table - Object, 表格属性
     * columns - Array, 表格列属性
     * column.width - String, 表格列宽度
     * column.label - String, 表格列名称
     * column.prop - String, 表格列字段
     * extraButtons - Array, 自定义按钮
     * extraButton.show - Function, 自定义按钮是否显示
     * extraButton.text - String, 自定义按钮文案
     * extraButton.attrs - Object, 自定义按钮的element ui属性
     * extraButton.eventName - String, 自定义按钮事件名
     * extraButton.click - Function, 自定义按钮点击回调
     */
    tableConfig: {
      type: Object,
      default: () => ({})
    },
    url: String, // 获取表格接口路径, 跟tableConfig.tableData二选一
    urlDelete: [String, Function], // 删除表格接口路径(跟tableConfig.tableData二选一), 默认是`url/${row.id}`(row为行对象), function则为urlDelete(record) => string
    extraParams: {
      // 所有url都会带上的请求参数
      type: Object,
      default: () => {}
    },
    paramSearchKey: String // 请求搜索接口时搜索字段名
  },
  data() {
    return {
      tableData: [],
      searchValue: "",
      searchKey: "",
      pageSize: 10,
      currentPage: 1,

      loading: {} // 请求loading
    }
  },
  computed: {
    // 数据总数
    totalNum() {
      return (this.tableData && this.tableData.length) || 0
    },

    // 当前展示的表格数据
    currentTableData() {
      let url = this.url,
        tableData = url ? this.tableData : this.tableConfig.tableData,
        hasPage = this.tableConfig.hasPage,
        currentPageTableData = []

      // 有分页器时截取表格数据, 容错
      if (hasPage && tableData) {
        let currentPage = this.currentPage,
          pageSize = this.pageSize

        currentPageTableData = tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      }

      let currentTableData = hasPage ? currentPageTableData : tableData
      return currentTableData
    },

    // 按钮的数量
    buttonsNum() {
      const { extraButtons, hasEdit, hasDelete } = this.tableConfig
      return (extraButtons?.length || 0) + !!hasEdit + !!hasDelete
    },

    // 操作列宽度
    operationWidth() {
      let width = ""
      switch (this.buttonsNum) {
        case 1:
          width = "104"
          break

        case 2:
          width = "160"
          break

        default:
          width = "210"
          break
      }
      return width
    }
  },
  watch: {
    totalNum() {
      // 当前页不存在时
      if (this.currentPage > Math.ceil(this.totalNum / this.pageSize)) {
        this.currentPage = 1
      }
    },

    extraParams(params) {
      Object.assign(this.params, params)
      this.refresh()
    }
  },
  created() {
    this.searchKey = this.paramSearchKey || "keyword"
    this.params = { ...this.extraParams }

    // 当传入表格url时, 则请求接口获取数据
    if (this.url) {
      this.refresh()
      return
    }

    // 没有传url时, 则通过传入数据渲染表格
    this.tableData = this.tableConfig.tableData
  },
  methods: {
    /**
     * @func
     * @desc 获取表信息
     */
    refresh() {
      if (!this.url) return

      // let searchKey = this.searchKey || "keyword"
      this.$axios
        .get(this.url, {
          params: this.params
        })
        .then(({ payload }) => {
          this.tableData = payload instanceof Array ? payload : payload.content
        })
    },

    /**
     * @func
     * @desc 获取url对象
     * @param {string} url url链接
     */
    /* getUrlObject(url) {
      let urlArr = splitUrl(url),
        params = urlArr.length > 1 ? `?${urlArr[1]}` : ""
      return {
        url: urlArr[0],
        params
      }
    }, */

    /**
     * @func
     * @desc 搜索
     */
    onSearch() {
      this.params[this.searchKey] = this.searchValue
      this.refresh()
    },

    /**
     * @func
     * @desc 单元格点击
     * @param {object} row 行数据对象
     * @param {object} column 单元格dom对象
     * @param {object} cell 单元格dom元素
     * @param {object} event 单元格点击事件
     */
    onCellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event)
    },

    /**
     * @func
     * @desc 自定义按钮点击
     * @param {number} index 行索引
     * @param {object} row 行对象
     * @param {object} button 按钮对象
     */
    onOperation(row, button) {
      isFunction(button.click) && button.click(row)

      this.$emit(button.eventName, row)
    },

    /**
     * @func
     * @desc 创建行对象
     */
    onCreate() {
      this.$emit("create")
    },

    /**
     * @func
     * @desc 编辑行对象
     * @param {object} row 行对象
     */
    onEdit(row) {
      this.$emit("edit", row)
    },

    /**
     * @func
     * @desc 删除行对象请求
     * @param {number} index 行索引
     * @param {object} row 行对象
     */
    delete(index, row) {
      let loading = this.loading.delete
      // 如果正在删除
      if (loading) return

      loading = true
      let tableUrl = this.url,
        tableUrlDelete = this.urlDelete
      // let tableData = tableUrl ? this.tableData : this.tableConfig.tableData

      // 请求删除接口
      let url = isFunction(tableUrlDelete)
        ? this.urlDelete(row)
        : `${tableUrlDelete || tableUrl}/${row.id}`

      this.$axios
        .$delete(url, { params: this.params })
        .then(() => {
          !tableUrl && this.tableConfig.tableData.splice(index, 1)
          this.$message({
            type: "success",
            message: "删除成功"
          })
          tableUrl && this.refresh()
        })
        .finally(() => {
          loading = false
        })
    },

    /**
     * @func
     * @desc 删除行对象
     * @param {number} index 行索引
     * @param {object} row 行对象
     */
    onDelete(index, row) {
      // 删除弹窗
      this.$confirm("删除后不可恢复，是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认删除
          this.delete(index, row)
        })
        .catch(() => {
          // 取消删除
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },

    /**
     * @func
     * @desc 改变当前页
     * @param {number} currentPage 当前页
     */
    onCurrentPageChange(currentPage) {
      this.currentPage = currentPage
    },

    /**
     * @func
     * @desc 更多按钮的操作
     * @param {object} param 按钮绑定的数据
     * @param {string} param.event 需要执行的事件
     * @param {array} param.args 传递的参数
     */
    onCommand(param) {
      const { event, args } = param
      this[event](...args)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/src/scss/var.scss";

.v-table-wrapper {
  // 服务表格
  .v-table {
    position: relative;
    width: 100%;
    overflow: auto;
    margin-bottom: 16px;

    &-top {
      margin-bottom: 16px;
    }
    // 创建按钮和搜索
    &-create-btn {
      display: inline-block;
      padding-left: 16px;
      padding-right: 16px;
    }

    &-search-input {
      float: right;
      width: 320px;
    }

    .iconfont {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      color: #c6c7ca;
      cursor: pointer;
      &:hover {
        color: $primaryColor;
      }
    }
  }

  // 分页器
  .v-table-pagination {
    float: right;
    padding-bottom: $paddingContainer;
  }

  // 操作按钮
  .operate-buttons-container {
    .el-button--text {
      padding: 0;
      color: #6a6c73;
      & + .el-button--text {
        margin-left: 16px;
      }
      &:hover {
        color: $primaryColor;
      }
      &.deleteButton {
        &:hover {
          color: #ff4d4f;
        }
      }
    }
    .el-dropdown {
      margin-left: 12px;
      vertical-align: middle;
    }
    .more-button {
      display: flex;
      .iconfont {
        margin: 0;
        color: #6a6c73;
      }
      &:hover {
        .iconfont {
          color: $primaryColor;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../../assets/src/scss/var.scss";

.v-table {
  &-blue {
    color: #2460e0;
    cursor: pointer;
  }

  .el-table__fixed-right {
    bottom: 0;
    height: auto !important;
  }
}
.more-button-dropdown-menu {
  &.el-dropdown-menu {
    padding: 8px 0;
    border: 0;
    box-shadow: 0px 2px 8px 0px rgba(45, 48, 59, 0.1);
    .el-dropdown-menu__item {
      min-width: 96px;
      padding: 0 16px;
      color: $textColorPrimary;
      &:focus,
      &:not(.is-disabled):hover {
        background-color: #f5f6f9;
      }
    }
    &.el-popper {
      &[x-placement^="bottom"] {
        margin-top: 4px;
      }
      &[x-placement^="top"] {
        margin-bottom: 4px;
      }
      .popper__arrow {
        display: none;
      }
    }
  }
}
</style>
