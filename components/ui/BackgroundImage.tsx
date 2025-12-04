'use client';

import React from 'react';

interface BackgroundImageProps {
  src: string;
  overlay?: {
    opacity?: number;
    color?: string;
    gradients?: string[];
  };
  children?: React.ReactNode;
  className?: string;
}

/**
 * 世界级背景图片组件 - 支持多种主题和优化
 *
 * @param src - 图片URL
 * @param overlay - 遮罩层配置
 * @param children - 子组件
 * @param className - 额外的CSS类名
 */
export function BackgroundImage({
  src,
  overlay = { opacity: 0.7, color: 'indigo' },
  children,
  className = ''
}: BackgroundImageProps) {
  const { opacity = 0.7, color = 'indigo', gradients = [] } = overlay;

  // 渐变色彩映射
  const gradientMap = {
    indigo: 'from-indigo-900/70 via-purple-900/70 to-pink-900/80',
    blue: 'from-blue-900/70 via-cyan-900/70 to-teal-900/80',
    purple: 'from-purple-900/70 via-pink-900/70 to-rose-900/80',
    green: 'from-green-900/70 via-emerald-900/70 to-cyan-900/80',
    tech: 'from-slate-900/60 via-blue-900/60 to-purple-900/70'
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${src}")`
          }}
        />

        {/* 主要渐变遮罩 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[color as keyof typeof gradientMap]}`} />

        {/* 额外渐变层（如果提供） */}
        {gradients.map((gradient, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{ background: gradient }}
          />
        ))}

        {/* 动态光效层 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 主光源 */}
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-amber-400/15 via-orange-500/8 to-transparent rounded-full filter blur-3xl animate-pulse duration-4000"></div>

          {/* 辅助光源 */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/15 via-cyan-500/8 to-transparent rounded-full filter blur-2xl animate-pulse duration-6000 delay-1000"></div>

          {/* 环境光 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/8 via-violet-500/4 to-transparent rounded-full filter blur-4xl animate-pulse duration-8000 delay-2000"></div>

          {/* 边缘光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform skew-y-12"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
        </div>

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * 预设的背景图片配置
 */
export const BackgroundPresets = {
  // 首页背景 - 现代AI工作空间
  homepage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2940&auto=format&fit=crop',

  // 行业选择背景 - 专业商务场景
  industry: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',

  // AI对话背景 - 智能科技场景
  chat: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop',

  // 画布页面背景 - 创意设计场景
  canvas: 'https://images.unsplash.com/photo-1559028012-c754a043b5d9?q=80&w=2940&auto=format&fit=crop',

  // 个人中心背景 - 现代办公场景
  profile: 'https://images.unsplash.com/photo-1606857521015-7f9fa224ead7?q=80&w=2940&auto=format&fit=crop'
};

/**
 * 便捷的预设背景组件
 */
export function PresetBackground({
  preset,
  children,
  overlay,
  className
}: Omit<BackgroundImageProps, 'src'> & {
  preset: keyof typeof BackgroundPresets
}) {
  return (
    <BackgroundImage
      src={BackgroundPresets[preset]}
      overlay={overlay}
      className={className}
    >
      {children}
    </BackgroundImage>
  );
}