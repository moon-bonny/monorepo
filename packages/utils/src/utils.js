import isPlainObject from "lodash/isPlainObject"
import dayjs from "dayjs"

/**
 * @func
 * @desc 格式化时间
 * @param {int} time 时间
 * @param {string} format 时间格式
 */
export function formatDate(time, format) {
  if (!time) {
    return ""
  }
  return dayjs(time).format(format)
}

/**
 * @func
 * @desc 根据模型从源数据映射相应数据
 * @param {Object} payload 源对象
 * @param {Object} model 目标对象模型
 */
export function mapObject(payload, model = {}) {
  return Object.keys(model).reduce((obj, key) => {
    obj[key] = payload[key]
    return obj
  }, {})
}

/**
 * @func
 * @desc 深拷贝
 * @params {obj | array} data 需深拷贝的数据
 */
export function deepClone(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * @func
 * @desc 获取搜索结果
 * @params {string} keyword 搜索关键字
 * @params {obj} origData 搜索源数据
 * @params {obj} [options] 搜索选项设置
 * @params {obj} [options.that] 页面对象
 * @params {string} [options.targetName] 搜索结果需要赋值的变量
 * @params {string} [options.field] 搜索关键字需要匹配的字段
 */
export function getSearchData(keyword, origData, options) {
  let _options = {
    that: null,
    targetName: "",
    field: ""
  }
  Object.assign(_options, options)
  keyword = keyword.trim() // keyword去掉前后空格

  if (!keyword && _options.targetName) {
    //关键字为空则返回所有数据
    _options.that[_options.targetName] = origData
    return
  } else if (!keyword) {
    return origData
  }

  let arr = []
  for (let i = 0; i < origData.length; i++) {
    let item = _options.field ? origData[i][_options.field] : origData[i]
    if (item.indexOf(keyword) > -1) {
      _options.field ? arr.push(origData[i]) : arr.push(item)
    }
  }
  return arr
}

/**
 * @func
 * @desc 获取选项选中的key数组
 * @params {obj} obj 数据对象
 * @params {string} selectField 表示是否选择的字段
 * @params {string} sortField 分类字段
 */
export function getTreeCheckedKeys(obj, selectField, sortField) {
  let checkedKeys = []
  for (let i = 0; i < obj.length; i++) {
    let children = obj[i].children
    if (!children || !children.length) {
      return
    }
    for (let j = 0; j < children.length; j++) {
      if (children[j][selectField]) {
        checkedKeys.push(children[j][sortField])
      }
      if (children.children) {
        getTreeCheckedKeys(children)
      }
    }
  }
  return checkedKeys
}

/**
 * @func
 * @desc 获取cookie的域
 * @return {string} cookie域
 */
export function getCookieDomain() {
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN
  }

  const host = location.host
  const hostSections = host.split(":")[0].split(".")

  // 排除localhost及ip
  const nonNormalHost =
    hostSections.length <= 1 || hostSections.join("").match(/^\d+$/)
  return nonNormalHost ? "" : "." + hostSections.splice(1).join(".")
}

/**
 * @func
 * @desc 检查浏览器是否支持webp格式 （via https://github.com/FEMessage/v-img/blob/dev/src/v-img.vue）
 * @return {Promise} 返回一个promise
 */
export function checkSupportWebp() {
  let isSupportWebp = JSON.parse(localStorage.getItem("isSupportWebp"))

  if (isSupportWebp !== null) {
    return Promise.resolve(isSupportWebp)
  }

  return new Promise(resolve => {
    const emptyWebp =
      "data:image/webp;base64,UklGRloAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAf1ZQOCAyAAAA0AEAnQEqAQABAAEAHCWgAnS6AfgAA7AA/vQ1H/6TZ4mzxNnySP/3UV+6iv3UV/7kqAA="
    const image = new Image()
    image.onload = () => {
      localStorage.setItem("isSupportWebp", true)
      resolve(!!(image.width && image.height))
    }
    image.onerror = () => {
      localStorage.setItem("isSupportWebp", false)
      resolve(false)
    }
    image.src = emptyWebp
  })
}

/**
 * @func
 * @desc store mutation的update
 * @param {object} state store state
 * @param {object} payload store mutation payload
 * @param {boolean} [isCover] 是否直接覆盖state而不是融合覆盖
 */
export function updateState(state, payload, isCover) {
  Object.keys(payload).forEach(k => {
    if (!isCover && isPlainObject(payload[k])) {
      state[k] = Object.assign({}, state[k], payload[k])
    } else {
      state[k] = payload[k]
    }
  })
}

/**
 * @func
 * @desc 提取URL的查询参数
 * @param {string} key 查询参数名称，如果不传，则返回全部
 * @return {string|object} 查询参数值
 */
export function extractURLQuery(key) {
  const params = location.search.slice(1).split("&")

  if (!key) {
    return params.reduce((obj, param) => {
      const [k, v] = param.split("=")
      obj[k] = v
      return obj
    }, {})
  }

  let value = ""
  params.some(item => {
    const [k, v] = item.split("=")
    if (k === key) {
      value = v
      return true
    }
  })
  return value
}

/**
 * @func
 * @desc 数组转换成对象集合形式
 * @param {array} arr 对象
 * @param {string} key 用于对象属性的对象元素的字段值
 * @return {object} 返回转换得到的对象
 */
export function arrayToObject(arr, key, valueKey) {
  return arr.reduce((obj, item) => {
    obj[item[key]] = valueKey ? item[valueKey] : item
    return obj
  }, {})
}

/**
 * @func
 * @desc 连字符转驼峰
 * @param {string} str 要转换的字符串
 * @return {string} 返回转换得到的字符串
 */
export function hyphensToCamelCase(str) {
  return str.replace(/-(\w)/g, function($0, $1) {
    return $1.toUpperCase()
  })
}
