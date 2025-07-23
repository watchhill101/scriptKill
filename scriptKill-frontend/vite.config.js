import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssImport from "postcss-import";
import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcssPxToRem from "postcss-pxtorem";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcssPostcss(),
        autoprefixer(),
        postcssPxToRem({
          rootValue: 37.5, // 375px 设计稿对应 37.5
          propList: ["*"], // 所有属性都转换
          selectorBlackList: [".ignore", ".hairlines"], // 忽略转换的选择器
          replace: true, // 替换原来的值
          mediaQuery: false, // 媒体查询中不转换
          minPixelValue: 2, // 最小转换像素值
          exclude: /node_modules/i, // 排除 node_modules
        }),
      ],
    },
  },
});
