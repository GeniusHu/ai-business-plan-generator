'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';

export default function SplashPage() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const { dispatch } = useProject();

  useEffect(() => {
    // 3秒倒计时自动跳转
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      handleStart();
    }
  }, [countdown]);

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 'onboarding' });
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Logo 区域 */}
      <div className="text-center mb-12">
        <div className="mb-8">
          {/* 简单的Logo设计 */}
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </div>
        </div>

        {/* Slogan */}
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

      {/* 装饰性元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      {/* 快速开始按钮 */}
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
