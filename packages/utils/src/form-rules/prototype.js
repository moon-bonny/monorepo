import initRules from "@/utils/form-rules/init-rules"
import validate from "@/utils/form-rules/validate"

export default {
  install(Vue) {
    Vue.prototype.$initRules = initRules
    Vue.prototype.$validate = validate
  }
}
