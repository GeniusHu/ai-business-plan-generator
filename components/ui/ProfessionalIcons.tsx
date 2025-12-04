'use client';

import React from 'react';
import {
  Target,
  Lightbulb,
  DollarSign,
  Sparkles,
  CheckCircle,
  Settings,
  Smartphone,
  Monitor,
  Wrench,
  Bot,
  Gem,
  Rocket,
  Palette,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Flame,
  Home,
  Car,
  Music,
  Gamepad2,
  Users,
  ShoppingBag
} from 'lucide-react';

/**
 * 专业图标映射表 - 替换所有emoji
 */
export const ProfessionalIconMap = {
  // 功能相关图标
  'idea': Lightbulb,
  'planning': Target,
  'execution': Wrench,
  'analysis': TrendingUp,
  'success': CheckCircle,
  'settings': Settings,
  'tools': Wrench,

  // 行业相关图标
  'tech': Monitor,
  'mobile': Smartphone,
  'ai': Bot,
  'finance': DollarSign,
  'retail': ShoppingBag,
  'home': Home,
  'car': Car,
  'music': Music,
  'gamepad': Gamepad2,
  'users': Users,

  // 状态和装饰图标
  'sparkle': Sparkles,
  'gem': Gem,
  'rocket': Rocket,
  'star': Star,
  'shield': Shield,
  'zap': Zap,
  'award': Award,
  'flame': Flame,
  'palette': Palette,

  // 基础操作图标
  'check': CheckCircle,
  'config': Settings,
  'build': Wrench,

  // 数据和分析图标
  'analytics': TrendingUp,

  // 购物图标
  'shopping': ShoppingBag,
};

interface ProfessionalIconProps {
  type: keyof typeof ProfessionalIconMap;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
  animated?: boolean;
}

/**
 * 专业图标组件 - 替换所有emoji使用
 */
export function ProfessionalIcon({
  type,
  size = 'md',
  variant = 'default',
  className = '',
  animated = false
}: ProfessionalIconProps) {
  const IconComponent = ProfessionalIconMap[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found in ProfessionalIconMap`);
    return <Sparkles className="w-5 h-5" />;
  }

  // 尺寸映射
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };

  // 颜色变体映射
  const variantMap = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    accent: 'text-emerald-600'
  };

  return (
    <IconComponent
      className={`
        ${sizeMap[size]}
        ${variantMap[variant]}
        ${animated ? 'transform transition-transform hover:scale-110' : ''}
        ${className}
      `}
    />
  );
}

/**
 * 图标文本组件 - 完全替换emoji+文字组合
 */
export function IconWithText({
  type,
  text,
  size = 'md',
  variant = 'default',
  className = '',
  animated = false
}: ProfessionalIconProps & {
  text: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ProfessionalIcon
        type={type}
        size={size}
        variant={variant}
        animated={animated}
      />
      <span className="text-current">{text}</span>
    </div>
  );
}

/**
 * 特色功能图标 - 用于特性卡片等场景
 */
export function FeatureIcon({
  type,
  size = 'lg',
  className = '',
  animated = true
}: {
  type: keyof typeof ProfessionalIconMap;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}) {
  const IconComponent = ProfessionalIconMap[type];

  if (!IconComponent) {
    return <Sparkles className="w-8 h-8" />;
  }

  const sizeMap = {
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="relative group">
      {/* 背景效果 */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20
          rounded-xl blur-lg opacity-0
          group-hover:opacity-100 transition-all duration-300
          transform group-hover:scale-110
        `}
      />

      {/* 图标容器 */}
      <div
        className={`
          relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600
          rounded-xl flex items-center justify-center shadow-lg
          ${animated ? 'transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3' : ''}
          ${className}
        `}
      >
        <IconComponent className={`w-8 h-8 text-white`} />
      </div>
    </div>
  );
}

/**
 * 行业图标组件 - 专门用于行业选择
 */
export function IndustryIcon({ industry }: { industry: string }) {
  // 行业到图标的映射
  const industryIconMap: Record<string, keyof typeof ProfessionalIconMap> = {
    'technology': 'tech',
    'finance': 'finance',
    'retail': 'mobile',
    'ai-tools': 'ai',
    'tools': 'tools',
    'content': 'settings',
    'education': 'idea',
    'healthcare': 'shield',
    'entertainment': 'palette',
    'food': 'sparkle',
    'travel': 'rocket',
    'sports': 'star',
    'realestate': 'home',
    'automotive': 'car',
    'fashion': 'palette',
    'music': 'music',
    'gaming': 'gamepad',
    'social': 'users',
    'productivity': 'check',
    'security': 'shield',
    'analytics': 'trending'
  };

  const iconType = industryIconMap[industry] || 'idea';

  return (
    <FeatureIcon
      type={iconType}
      className="industry-icon"
    />
  );
}