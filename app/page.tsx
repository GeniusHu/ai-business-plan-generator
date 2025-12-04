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
        {/* 世界级背景图片：现代AI工作空间 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2940&auto=format&fit=crop")`
          }}
        ></div>

        {/* 世界级渐变遮罩层 - 苹果级色彩处理 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-indigo-900/50 to-purple-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-indigo-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 via-transparent to-pink-900/30"></div>
        </div>

        {/* 好莱坞级动态光效层 - 电影制作标准 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 主光源 - 柔和的金色光芒 */}
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent rounded-full filter blur-3xl animate-pulse duration-4000"></div>

          {/* 辅助光源 - 科技蓝光 */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent rounded-full filter blur-2xl animate-pulse duration-6000 delay-1000"></div>

          {/* 环境光 - 神秘紫色 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-full filter blur-4xl animate-pulse duration-8000 delay-2000"></div>

          {/* 边缘光效 - 增强深度 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-y-12"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
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
        {/* Logo 区域 - 苹果级设计标准 */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="relative mb-12">
            {/* 多层发光效果 - 科技感 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl animate-pulse duration-3000"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl animate-pulse duration-4000 delay-1000"></div>

            {/* Logo 玻璃态容器 */}
            <div className="relative w-28 h-28 bg-white/8 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden">
              {/* 内部渐变装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-cyan-500/5"></div>

              {/* Logo 文字 */}
              <div className="relative text-5xl font-black bg-gradient-to-br from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent tracking-wider drop-shadow-2xl">
                AI
              </div>
            </div>

            {/* 世界级装饰元素 */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full shadow-lg animate-pulse duration-2000"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg animate-ping"></div>

            {/* 新增：高端光点装饰 */}
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-white/80 rounded-full shadow-lg"></div>
            <div className="absolute bottom-2 right-1/3 w-1.5 h-1.5 bg-cyan-300/80 rounded-full shadow-md"></div>
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

        {/* 奢华级特性卡片 - 蒂芙尼级别设计 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl w-full transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* 想法评估卡片 */}
          <div className="group relative">
            {/* 背景发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"></div>

            {/* 卡片主体 */}
            <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:bg-white/12 transition-all duration-700 group-hover:shadow-2xl overflow-hidden">
              {/* 内部装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent rounded-3xl"></div>

              {/* 图标容器 - 奢华设计 */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-500 overflow-hidden">
                  {/* 内部光效 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"></div>
                  <Lightbulb className="relative w-8 h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* 图标光环 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-indigo-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>

              {/* 标题和描述 */}
              <div className="flex items-center mb-3">
                <Lightbulb className="w-6 h-6 text-blue-200 mr-2" />
                <h3 className="text-white font-bold text-xl group-hover:text-blue-100 transition-colors duration-300">想法评估</h3>
              </div>
              <p className="text-blue-100/90 text-base leading-relaxed">AI智能分析你的产品构思可行性，避免走弯路</p>

              {/* 底部装饰线 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </div>
          </div>

          {/* 功能规划卡片 */}
          <div className="group relative">
            {/* 背景发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"></div>

            {/* 卡片主体 */}
            <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:bg-white/12 transition-all duration-700 group-hover:shadow-2xl overflow-hidden">
              {/* 内部装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent rounded-3xl"></div>

              {/* 图标容器 */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"></div>
                  <ClipboardList className="relative w-8 h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-transparent to-pink-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>

              <div className="flex items-center mb-3">
                <ClipboardList className="w-6 h-6 text-purple-200 mr-2" />
                <h3 className="text-white font-bold text-xl group-hover:text-purple-100 transition-colors duration-300">功能规划</h3>
              </div>
              <p className="text-purple-100/90 text-base leading-relaxed">生成详细的功能清单，知道要做什么</p>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </div>
          </div>

          {/* 执行指导卡片 */}
          <div className="group relative">
            {/* 背景发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"></div>

            {/* 卡片主体 */}
            <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:bg-white/12 transition-all duration-700 group-hover:shadow-2xl overflow-hidden">
              {/* 内部装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-pink-500/5 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-transparent rounded-3xl"></div>

              {/* 图标容器 */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-pink-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"></div>
                  <Wrench className="relative w-8 h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-transparent to-amber-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>

              <div className="flex items-center mb-3">
                <Wrench className="w-6 h-6 text-pink-200 mr-2" />
                <h3 className="text-white font-bold text-xl group-hover:text-pink-100 transition-colors duration-300">执行指导</h3>
              </div>
              <p className="text-pink-100/90 text-base leading-relaxed">手把手教你从零开始，技术成本时间都搞定</p>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/* 奢华级CTA按钮 - 劳斯莱斯级别 */}
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            {/* 按钮光环效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-blue-200/40 to-purple-200/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-purple-200/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

            {/* 主按钮 */}
            <Button
              size="lg"
              onClick={handleStart}
              className="relative bg-white/95 backdrop-blur-xl text-indigo-900 hover:bg-blue-50 px-12 py-5 text-xl font-bold shadow-2xl hover:shadow-blue-300/50 transition-all duration-700 transform hover:scale-105 border-2 border-white/30 rounded-2xl group overflow-hidden"
            >
              {/* 按钮内部装饰 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* 按钮内容 */}
              <div className="relative flex items-center">
                <div className="mr-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  <Play className="w-6 h-6" />
                </div>
                <div className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  <span className="tracking-wide">把想法变成产品</span>
                </div>
                <div className="ml-3 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* 按钮边缘光效 */}
              <div className="absolute inset-0 rounded-2xl border border-white/50 shadow-inner"></div>
            </Button>

            {/* 悬浮装饰元素 */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 delay-200">
              <Sparkles className="w-4 h-4 text-white m-auto" />
            </div>
            <div className="absolute -bottom-1 left-2 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-70 transform scale-0 group-hover:scale-100 transition-all duration-500 delay-300"></div>
          </div>

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