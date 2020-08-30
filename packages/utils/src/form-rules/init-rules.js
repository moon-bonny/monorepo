import validate from "./validate"
import { RULES } from "./rules"

/**
 * @func
 * @desc 表单规则转换
 * @param {array} rules 规则数组
 * @param {string} rule.label 规则字段名称
 * @param {string} rule.prop 规则字段
 * @param {string} [rule.type] 规则字段表单类型，默认值'input'
 * @param {string} [rule.trigger] 规则校验触发方式，type=input时默认为blur，type=select时默认为change
 * @param {boolean} [rule.required] 是否必填
 * @param {string} [rule.message] 规则校验失败提示，只指定required时有效
 * @param {string} [rule.rule] 预设规则代码
 * @param {array} [rule.rules] 指定规则（见 validate.js 各类型），优先级高于rule.rule
 * @param {array} [rule.conditions] 与rule.rules对应的条件
 * @param {function} [rule.validator] 自定义校验函数，参数同el-form的规则validator，若指定validator，优先使用
 * @return {array} 转换后的表单规则
 */
export default function(rules) {
  return rules.reduce((obj, item) => {
    const {
      label,
      prop,
      type,
      trigger,
      required,
      message,
      validator,
      rule: fieldRule,
      rules: fieldRules,
      conditions: fieldConditions
    } = item
    const ruleDetail = {
      trigger: trigger || (type === "select" ? "change" : "blur"),
      required: !!required
    }

    // validator 优先级最高
    if (typeof validator === "function") {
      ruleDetail.validator = validator
      obj[prop] = [ruleDetail]
      return obj
    }

    // 不指定规则时，仅判断是否 required
    if (!fieldRule && !fieldRules) {
      const typeName = type === "select" ? "选择" : "输入"
      Object.assign(ruleDetail, {
        required: required || false,
        message: message || `请${typeName}${label}`
      })
    } else {
      let validatorRules = {}

      // 规则指定
      if (fieldRules && Array.isArray(fieldRules)) {
        validatorRules = {
          rules: fieldRules,
          conditions: fieldConditions || []
        }
      } else if (fieldRule) {
        validatorRules = { ...RULES[fieldRule] }
      }

      // required 覆盖判断
      const index = validatorRules.rules.findIndex(rule => rule === "required")
      if (typeof required !== "undefined") {
        if (required && index === -1) {
          validatorRules.rules.push("required")
        } else if (!required && index > -1) {
          validatorRules.rules.splice(index, 1)
        }
      } else if (index > -1) {
        ruleDetail.required = true
      }

      ruleDetail.validator = (rule, value, callback) => {
        let _validator = {
          label,
          value,
          ...validatorRules
        }

        const { valid, message } = validate(_validator)

        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      }
    }

    obj[prop] = [ruleDetail]
    return obj
  }, {})
}
