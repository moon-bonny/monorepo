<script>
export default {
  name: "TextHiddenTooltip",
  data() {
    return {
      // 是否显示提示层
      isDisabled: true,
      // content元素的监听对象
      contentObserver: null
    }
  },
  mounted() {
    this.initContentObserver()
    this.computedTooltipShow()
    window.addEventListener("resize", this.computedTooltipShow)
  },
  beforeDestroy() {
    this.contentObserver.disconnect()
    window.removeEventListener("resize", this.computedTooltipShow)
  },
  methods: {
    /**
     * @func
     * @desc 计算是否需要显示提示框
     */
    computedTooltipShow() {
      const width = this.$el.offsetWidth
      const contentWidth = this.$refs.content.offsetWidth
      this.isDisabled = width >= contentWidth
    },
    /**
     * @func
     * @desc 初始化content元素的观察者
     */
    initContentObserver() {
      this.contentObserver = new MutationObserver(() =>
        this.computedTooltipShow()
      )
      this.contentObserver.observe(this.$refs.content, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
  },
  render() {
    return (
      <el-tooltip
        props={{ placement: "top", ...this.$attrs, disabled: this.isDisabled }}
      >
        <span class="ellipsis text-hidden-tooltip">
          <span ref="content" class="content">
            {this.$slots.default}
          </span>
        </span>
        <div slot="content">{this.$slots.default}</div>
      </el-tooltip>
    )
  }
}
</script>

<style lang="scss" scoped>
.text-hidden-tooltip {
  display: inline-block;
  .content {
    display: inline;
    cursor: text;
  }
}
</style>
