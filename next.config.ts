// Next.js框架配置文件 - 相当于Android中的AndroidManifest.xml和application级别的配置
import type { NextConfig } from "next";

// Next.js配置对象 - 定义整个应用的行为和特性
const nextConfig: NextConfig = {
  /* 配置选项 */

  // 图片优化配置 - 提升加载性能和用户体验
  images: {
    // 使用新的remotePatterns替代domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pixabay.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 启用现代化的图片格式
    formats: ['image/avif', 'image/webp'],
    // 设置图片尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 设置图片质量
    minimumCacheTTL: 60,
  },

  // 性能优化配置
  poweredByHeader: false,
  generateEtags: false,

  // 压缩配置
  compress: true,

  // 启用现代化特性
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true,
  },
};

// 导出配置，让Next.js应用能够使用这些配置
export default nextConfig;
