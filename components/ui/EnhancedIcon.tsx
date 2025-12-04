'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface EnhancedIconProps {
  icon: LucideIcon;
  variant?: IconVariant;
  size?: IconSize;
  animated?: boolean;
  elevated?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * 世界级增强图标组件 - 奢华级视觉效果
 *
 * @param icon - Lucide图标组件
 * @param variant - 颜色变体
 * @param size - 图标尺寸
 * @param animated - 是否启用动画
 * @param elevated - 是否提升效果
 * @param className - 额外的CSS类名
 * @param onClick - 点击事件
 */
export function EnhancedIcon({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  animated = true,
  elevated = false,
  className = '',
  onClick
}: EnhancedIconProps) {
  // 尺寸映射
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };

  // 容器尺寸映射
  const containerSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  // 变体颜色映射
  const variantGradients = {
    primary: 'from-blue-500 via-blue-600 to-indigo-600',
    secondary: 'from-purple-500 via-purple-600 to-pink-600',
    accent: 'from-emerald-500 via-emerald-600 to-cyan-600',
    success: 'from-green-500 via-green-600 to-emerald-600',
    warning: 'from-amber-500 via-orange-600 to-red-600',
    error: 'from-red-500 via-rose-600 to-pink-600'
  };

  // 发光效果映射
  const glowColors = {
    primary: 'from-blue-400/30 via-transparent to-indigo-400/30',
    secondary: 'from-purple-400/30 via-transparent to-pink-400/30',
    accent: 'from-emerald-400/30 via-transparent to-cyan-400/30',
    success: 'from-green-400/30 via-transparent to-emerald-400/30',
    warning: 'from-amber-400/30 via-transparent to-red-400/30',
    error: 'from-red-400/30 via-transparent to-rose-400/30'
  };

  const iconSizeClass = sizeMap[size];
  const containerSizeClass = containerSizeMap[size];
  const gradientClass = variantGradients[variant];
  const glowClass = glowColors[variant];

  const isInteractive = !!onClick;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${containerSizeClass}
        ${isInteractive ? 'cursor-pointer' : ''}
        ${animated ? 'group' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* 背景发光效果 */}
      <div
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-br ${gradientClass}
          blur-xl opacity-0
          ${animated ? 'group-hover:opacity-60' : ''}
          ${elevated ? 'opacity-40' : ''}
          transition-all duration-500
          ${animated ? 'group-hover:scale-110' : ''}
        `}
      />

      {/* 主容器 */}
      <div
        className={`
          relative ${containerSizeClass}
          bg-gradient-to-br ${gradientClass}
          rounded-xl
          flex items-center justify-center
          shadow-lg
          ${elevated ? 'shadow-2xl' : ''}
          ${animated ? 'transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3' : ''}
          ${isInteractive ? 'hover:shadow-xl' : ''}
          overflow-hidden
        `}
      >
        {/* 内部光效 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-60" />

        {/* 图标 */}
        <Icon
          className={`
            ${iconSizeClass}
            text-white
            relative z-10
            ${animated ? 'transform transition-all duration-300' : ''}
          `}
        />

        {/* 高光效果 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 环绕光环 */}
      <div
        className={`
          absolute inset-0 rounded-xl
          bg-gradient-to-br ${glowClass}
          blur-md opacity-0
          ${animated ? 'group-hover:opacity-100' : ''}
          transition-opacity duration-500
          pointer-events-none
        `}
      />
    </div>
  );
}

/**
 * 简化版图标 - 用于密集使用场景
 */
export function SimpleIcon({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = ''
}: Omit<EnhancedIconProps, 'animated' | 'elevated' | 'onClick'>) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };

  const variantColors = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    accent: 'text-emerald-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    error: 'text-red-500'
  };

  return (
    <Icon
      className={`
        ${sizeMap[size]}
        ${variantColors[variant]}
        ${className}
      `}
    />
  );
}

/**
 * 图标容器组件 - 用于特性卡片等场景
 */
export function IconContainer({
  children,
  variant = 'primary',
  size = 'md',
  elevated = true,
  animated = true,
  className = ''
}: Omit<EnhancedIconProps, 'icon'> & {
  children: React.ReactNode;
}) {
  const containerSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const variantGradients = {
    primary: 'from-blue-500 via-blue-600 to-indigo-600',
    secondary: 'from-purple-500 via-purple-600 to-pink-600',
    accent: 'from-emerald-500 via-emerald-600 to-cyan-600',
    success: 'from-green-500 via-green-600 to-emerald-600',
    warning: 'from-amber-500 via-orange-600 to-red-600',
    error: 'from-red-500 via-rose-600 to-pink-600'
  };

  return (
    <div
      className={`
        ${containerSizeMap[size]}
        bg-gradient-to-br ${variantGradients[variant]}
        rounded-2xl
        flex items-center justify-center
        ${elevated ? 'shadow-xl' : 'shadow-lg'}
        ${animated ? 'transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3' : ''}
        overflow-hidden
        ${className}
      `}
    >
      {/* 内部装饰 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-60" />

      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}