'use client';  // 声明此组件为客户端组件，需要浏览器环境

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';

/**
 * 启动页面组件
 * 显示应用Logo、介绍信息，并提供自动倒计时跳转功能
 * 类似于Android应用启动时的SplashScreen
 */
export default function SplashPage() {
  const [countdown, setCountdown] = useState(3);        // 倒计时状态（3秒）
  const router = useRouter();                           // Next.js路由实例
  const { dispatch } = useProject();                   // 获取状态更新函数

  // 倒计时逻辑：3秒后自动跳转到引导页面
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);                                      // 1000毫秒 = 1秒
      return () => clearTimeout(timer);               // 清理定时器
    } else {
      handleStart();                                  // 倒计时结束，开始应用流程
    }
  }, [countdown]);                                    // 依赖数组：countdown变化时重新执行

  /**
   * 开始应用的函数
   * 更新状态并跳转到引导页面
   * 类似于Android中启动下一个Activity
   */
  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 'industry' });
    router.push('/industry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Logo 和品牌信息区域 */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          一句话生成<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            小程序/APP商业计划书
          </span>
        </h1>

        <p className="text-blue-200 text-lg md:text-xl max-w-md mx-auto">
          AI驱动，专为创业者打造的智能商业计划生成工具
        </p>
      </div>

      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* 开始按钮区域 */}
      <div className="relative z-10">
        <Button
          size="lg"
          onClick={handleStart}
          className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          快速开始
          <span className="ml-2 text-blue-600">
            {countdown > 0 && `(${countdown}s)`}
          </span>
        </Button>

        {countdown > 0 && (
          <p className="text-center text-blue-200 mt-4 text-sm">
            倒计时自动跳转...
          </p>
        )}
      </div>
    </div>
  );
}