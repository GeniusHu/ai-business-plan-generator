'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';
import { Sparkles, ArrowRight, Play, Lightbulb, ClipboardList, Wrench } from 'lucide-react';

export default function SplashPage() {
  const [countdown, setCountdown] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { dispatch } = useProject();

  // 页面加载动画
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 倒计时逻辑
  // useEffect(() => {
  //   if (countdown > 0) {
  //     const timer = setTimeout(() => {
  //       setCountdown(countdown - 1);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     handleStart();
  //   }
  // }, [countdown]);

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 'industry' });
    router.push('/industry');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 高质量背景图片叠加渐变 */}
      <div className="absolute inset-0">
        {/* 使用Unsplash的免费高质量图片 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop")`
          }}
        ></div>

        {/* 渐变遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80"></div>

        {/* 动态光效层 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-300"></div>
          <div className="absolute -bottom-1/2 left-1/3 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute bottom-0 right-1/3 w-1/3 h-1/3 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-1000"></div>
        </div>

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo 区域 */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="relative mb-12">
            {/* 发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

            {/* Logo 容器 */}
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI
              </div>
            </div>

            {/* 装饰元素 */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* 标题区域 */}
        <div className={`text-center mb-8 max-w-3xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block mb-2">有个好想法？</span>
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI帮你变成可执行的产品方案
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            不需要技术背景，AI智能分析你的想法
            <br />
            <span className="text-blue-200/80 text-base mt-2 block">
              生成清晰的功能清单 + 手把手执行指南，让每个好想法都能落地
            </span>
          </p>
        </div>

        {/* 特性卡片 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">💡 想法评估</h3>
            </div>
            <p className="text-blue-100/80 text-sm">AI智能分析你的产品构思可行性，避免走弯路</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">📋 功能规划</h3>
            </div>
            <p className="text-blue-100/80 text-sm">生成详细的功能清单，知道要做什么</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">🛠️ 执行指导</h3>
            </div>
            <p className="text-blue-100/80 text-sm">手把手教你从零开始，技术成本时间都搞定</p>
          </div>
        </div>

        {/* 开始按钮区域 */}
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Button
            size="lg"
            onClick={handleStart}
            className="bg-white text-indigo-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-300/25 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            💡 把想法变成产品
            {/*<span className="ml-3 text-indigo-600">*/}
            {/*  {countdown > 0 && `(${countdown}s)`}*/}
            {/*</span>*/}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/*{countdown > 0 && (*/}
          {/*  <p className="text-center text-blue-200/80 mt-6 animate-pulse">*/}
          {/*    <span className="inline-flex items-center">*/}
          {/*      <span className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-ping"></span>*/}
          {/*      系统将在 {countdown} 秒后自动开始...*/}
          {/*    </span>*/}
          {/*  </p>*/}
          {/*)}*/}
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </div>

      {/* 侧边装饰元素 */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-10 blur-2xl"></div>
    </div>
  );
}