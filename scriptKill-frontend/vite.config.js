import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import postcssPxToRem from "postcss-pxtorem";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        autoprefixer(),
        postcssPxToRem({
          rootValue: 16, // 以16px为基准
          propList: ["*"], // 所有属性都转换
          selectorBlackList: [".ignore", ".hairlines"], // 忽略转换的选择器
          replace: true, // 替换原来的值
          mediaQuery: false, // 媒体查询中不转换
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
