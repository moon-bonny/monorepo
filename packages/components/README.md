# `@monorepo/components` 包

## 全局注册

在 vue 项目的 main.js 中全局注册组件库，配合使用 `@monorepo/assets` 的样式文件

```
import Components from "@monorepo/components"
import "@monorepo/assets/src/scss/global.scss"
import "@monorepo/assets/src/scss/element-var.scss"

Vue.use(Components)
```