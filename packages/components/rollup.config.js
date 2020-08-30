// rollup.config.js
import resolve from "rollup-plugin-node-resolve"
import vue from "rollup-plugin-vue"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"

const config = {
  input: "src/index.js",
  output: {
    name: "IconFont",
    exports: "named",
    globals: {
      vue: "Vue"
    }
    // external: ["vue"],
  },
  plugins: [
    resolve(),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      presets: ["@vue/babel-preset-jsx"],
      exclude: "**/node_modules/**"
    }),
    commonjs(),
    image()
  ]
}

export default config
