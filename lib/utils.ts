// ============================================================================
// 工具函数库 - 类似于Android中的Utils类
// ============================================================================

import { type ClassValue, clsx } from 'clsx';          // CSS类名条件化工具
import { twMerge } from 'tailwind-merge';             // Tailwind CSS类名合并工具

// ============================================================================
// CSS 类名处理工具
// ============================================================================

/**
 * 合并CSS类名的工具函数
 * 结合clsx的条件化类名和tailwind-merge的冲突解决功能
 * 类似于Android中动态设置View样式的工具函数
 *
 * @param inputs - CSS类名输入，可以是字符串、对象、数组等
 * @returns 合并后的CSS类名字符串
 *
 * @example
 * cn('base-class', isActive && 'active-class', { 'conditional-class': true })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));                         // 先用clsx条件化处理，再用twMerge解决冲突
}

// ============================================================================
// 日期格式化工具
// ============================================================================

/**
 * 格式化日期为中文格式
 * 类似于Android中的日期格式化工具
 *
 * @param date - 要格式化的日期对象
 * @returns 格式化后的日期字符串
 *
 * @example
 * formatDate(new Date()) // "2023年12月25日 14:30"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {             // 使用中文格式化
    year: 'numeric',                                   // 数值年份（如：2023）
    month: 'long',                                     // 完整月份名称（如：十二月）
    day: 'numeric',                                    // 数值日期（如：25）
    hour: '2-digit',                                   // 两位数小时（如：14）
    minute: '2-digit'                                  // 两位数分钟（如：30）
  }).format(date);
}

// ============================================================================
// ID生成工具
// ============================================================================

/**
 * 生成唯一标识符
 * 组合时间戳和随机字符串，确保唯一性
 * 类似于Android中的UUID生成工具
 *
 * @returns 唯一的ID字符串
 *
 * @example
 * generateId() // "1702514230000abc123def"
 */
export function generateId(): string {
  return Date.now().toString() +                       // 时间戳（毫秒）
         Math.random()                                 // 随机数
           .toString(36)                               // 转换为36进制（a-z0-9）
           .substr(2, 9);                              // 取中间9位，避免浮点数精度问题
}

// ============================================================================
// 函数防抖工具
// ============================================================================

/**
 * 函数防抖工具
 * 在指定时间内重复调用只执行最后一次
 * 类似于Android中防止快速点击的工具
 *
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 *
 * @example
 * const debouncedSearch = debounce(searchAPI, 300);
 * debouncedSearch('keyword'); // 300ms内再次调用会取消前一次
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,                                             // 要防抖的函数
  wait: number                                         // 等待时间
): (...args: Parameters<T>) => void {                  // 返回相同参数类型的函数
  let timeout: NodeJS.Timeout;                         // 定时器引用

  return (...args: Parameters<T>) => {                 // 返回防抖后的函数
    clearTimeout(timeout);                             // 清除之前的定时器

    // 设置新的定时器，延迟执行原函数
    timeout = setTimeout(() => {
      func(...args);                                   // 使用展开语法保持参数
    }, wait);
  };
}