/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  prefix: 'tw-', // 添加前缀避免冲突
  corePlugins: {
    preflight: false, // 禁用基础样式重置
  }
}