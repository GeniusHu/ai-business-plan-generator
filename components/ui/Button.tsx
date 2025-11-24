// ============================================================================
// 自定义按钮组件 - 类似于Android中的MaterialButton或自定义Button View
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';                          // 工具函数：合并CSS类名

// ============================================================================
// 组件属性接口定义
// ============================================================================

/**
 * 按钮组件属性接口
 * 继承原生HTML按钮属性，并添加自定义属性
 * 类似于Android中自定义View的属性定义
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // 按钮变体样式
  size?: 'sm' | 'md' | 'lg';                               // 按钮尺寸
  children: React.ReactNode;                               // 按钮内容
}

// ============================================================================
// 按钮组件实现
// ============================================================================

/**
 * 自定义按钮组件
 * 提供统一的按钮样式和行为，支持多种变体和尺寸
 * @param variant 按钮样式变体，默认为'primary'
 * @param size 按钮尺寸，默认为'md'
 * @param className 自定义CSS类名
 * @param children 按钮内容
 * @param props 其他原生按钮属性
 */
export function Button({
  variant = 'primary',                                     // 默认主要样式
  size = 'md',                                             // 默认中等尺寸
  className,                                               // 自定义类名
  children,                                               // 子组件
  ...props                                                 // 其他原生属性
}: ButtonProps) {
  // ============================================================================
  // 样式定义
  // ============================================================================

  // 基础样式：所有按钮共享的样式
  // 类似于Android中按钮的基础样式
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // 按钮变体样式配置
  // 类似于Android中的不同按钮主题
  const variants = {
    // 主要按钮：蓝色背景，白色文字，用于主要操作
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',

    // 次要按钮：灰色背景，白色文字，用于次要操作
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',

    // 轮廓按钮：白色背景，边框，用于次要操作
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',

    // 幽灵按钮：透明背景，只有文字，用于低调操作
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-blue-500'
  };

  // 按钮尺寸配置
  // 类似于Android中的不同按钮尺寸样式
  const sizes = {
    sm: 'h-8 px-4 text-sm',                               // 小尺寸：高度8，内边距4，小字体
    md: 'h-12 px-6 text-base',                            // 中等尺寸：高度12，内边距6，正常字体
    lg: 'h-14 px-8 text-lg'                               // 大尺寸：高度14，内边距8，大字体
  };

  // ============================================================================
  // 渲染函数
  // ============================================================================

  return (
    <button
      // 合并所有CSS类名：基础样式 + 变体样式 + 尺寸样式 + 自定义类名
      className={cn(baseStyles, variants[variant], sizes[size], className)}

      // 将其他原生属性传递给button元素
      {...props}                                            // 展开其他原生属性（如onClick、disabled等）
    >
      {children}                                           {/* 渲染按钮内容 */}
    </button>
  );
}