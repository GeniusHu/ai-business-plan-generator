'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';
import {
  Sparkles, Zap, Target, ArrowRight, Play,
  Users, TrendingUp, Shield, Clock
} from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const { dispatch } = useProject();

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 'industry' });
    router.push('/industry');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* 高质量背景图片 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo 区域 */}
        <div className="transform transition-all duration-1000 translate-y-0 opacity-100">
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
          </div>
        </div>

        {/* 标题区域 */}
        <div className="text-center mb-12 max-w-4xl transform transition-all duration-1000 delay-300 translate-y-0 opacity-100">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            <span className="block mb-4">一句话生成</span>
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              小程序/APP商业计划书
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed mb-8">
            🚀 AI驱动，专为创业者打造的智能商业计划生成工具
            <br />
            <span className="text-blue-200/80 text-lg mt-4 block">
              5分钟完成专业商业计划，助力创业梦想腾飞
            </span>
          </p>

          {/* 核心优势数据 */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-200/80 text-sm">创业用户信赖</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5分钟</div>
              <div className="text-blue-200/80 text-sm">生成专业计划</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-200/80 text-sm">用户满意度</div>
            </div>
          </div>
        </div>

        {/* 增强特性卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl w-full transform transition-all duration-1000 delay-500 translate-y-0 opacity-100">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">精准分析</h3>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">AI深度分析产品构思，生成专业建议</p>
            <div className="flex items-center text-blue-200 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              提升成功率85%
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">快速生成</h3>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">5分钟完成传统需要数周的商业计划制作</p>
            <div className="flex items-center text-blue-200 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              节省95%时间
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">专业品质</h3>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">符合投资机构要求的专业级商业计划</p>
            <div className="flex items-center text-blue-200 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              投资机构认可
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">成功案例</h3>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">已帮助数千创业者获得融资成功</p>
            <div className="flex items-center text-blue-200 text-xs">
              <Target className="w-3 h-3 mr-1" />
              成功案例500+
            </div>
          </div>
        </div>

        {/* 开始按钮区域 */}
        <div className="transform transition-all duration-1000 delay-700 translate-y-0 opacity-100">
          <Button
            size="lg"
            onClick={handleStart}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-green-300/25 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm group rounded-2xl"
          >
            <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            立即开始创建
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-8 text-blue-200/80">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">系统就绪</span>
              </div>
              <div className="text-sm">✨ 完全免费使用</div>
              <div className="text-sm">🔒 数据安全保护</div>
            </div>
          </div>
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