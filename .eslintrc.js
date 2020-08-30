module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ["eslint:recommended", "plugin:vue/essential"],
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: ["vue"],
  rules: {
    "prettier/prettier": [
      "off",
      {
        quotes: 0
      }
    ]
  }
}
