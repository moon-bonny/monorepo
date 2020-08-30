// import validate from "./validate"

export const RULE_CODE = "code"
export const RULE_NAME = "name"
export const RULE_DESCRIPTION = "description"
export const RULE_GENERAL_NAME = "generalName"
export const RULE_GENERAL_NAME_EN = "generalNameEn"
// export const RULE_DATABASE_NAME = "databaseName"
export const RULES = {
  [RULE_CODE]: {
    rules: ["variable", "max", "required"],
    conditions: [32]
  },
  [RULE_NAME]: {
    rules: ["name", "max", "required"],
    conditions: [32]
  },
  [RULE_DESCRIPTION]: {
    rules: ["max"],
    conditions: [150]
  },
  [RULE_GENERAL_NAME]: {
    rules: ["generalName", "max", "required"],
    conditions: [32]
  },
  [RULE_GENERAL_NAME_EN]: {
    rules: ["generalNameEn", "required"]
  }
  /* [RULE_DATABASE_NAME]: {
    rules: ["english", "required"]
  } */
}
export const RULES_PRESET = {
  name: { label: "名称", prop: "name", rule: RULE_NAME },
  code: { label: "编码", prop: "code", rule: RULE_CODE },
  description: { label: "描述", prop: "description", rule: RULE_DESCRIPTION }
}
