// Import vue component
import IconButton from "./icon-button/index"
import IconFont from "./icon-font/index"
import IconTooltip from "./icon-tooltip/index"
import LayoutHeader from "./layout-header/index"
import LayoutSidebar from "./layout-sidebar/index"
import PageIntroduce from "./page-introduce/index"
import TextHiddenTooltip from "./text-hidden-tooltip/index"
import VTable from "./v-table/index"

// Declare install function executed by Vue.use()
/* export function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component(IconFont.name, component)
}

// Create module definition for Vue.use()
const plugin = {
  install
} */
const components = [
  IconButton,
  IconFont,
  IconTooltip,
  LayoutHeader,
  LayoutSidebar,
  PageIntroduce,
  TextHiddenTooltip,
  VTable
]

// will install the plugin only once
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

// Auto-install when vue is found (eg. in browser via <script> tag)
/* let GlobalVue = null
if (typeof window !== "undefined") {
  GlobalVue = window.Vue
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(IconFont)
} */

// To allow use as module (npm/webpack/etc.) export component
export default { install, IconFont, TextHiddenTooltip }

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
