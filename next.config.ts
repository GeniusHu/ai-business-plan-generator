// Next.js框架配置文件 - 相当于Android中的AndroidManifest.xml和application级别的配置
import type { NextConfig } from "next";

// Next.js配置对象 - 定义整个应用的行为和特性
const nextConfig: NextConfig = {
  /* 在这里添加配置选项 */
  // 例如：
  // experimental: {},           // 实验性功能
  // images: {},                 // 图片优化配置
  // env: {},                    // 环境变量
  // redirects: [],              // URL重定向规则
  // rewrites: [],               // URL重写规则
  // webpack: (config, {}) => {}, // Webpack自定义配置
  // sassOptions: {},            // SASS/SCSS配置
};

// 导出配置，让Next.js应用能够使用这些配置
export default nextConfig;
