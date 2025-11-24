'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';
import { ChevronRight, Sparkles, Target, Zap } from 'lucide-react';

const onboardingSteps = [
  {
    id: 1,
    title: '不会写商业计划？',
    subtitle: '没关系。',
    description: '传统商业计划书制作复杂、耗时，让很多创业者望而却步。我们改变了这一切。',
    icon: <Target className="w-12 h-12 text-blue-500" />,
    bgColor: 'bg-blue-50',
    illustration: (
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  },
  {
    id: 2,
    title: '一键生成专业BP',
    subtitle: 'AI自动生成画布效果图',
    description: '回答5个简单问题，AI就能为你生成专业的商业模式画布和完整的商业计划书。',
    icon: <Sparkles className="w-12 h-12 text-purple-500" />,
    bgColor: 'bg-purple-50',
    illustration: (
      <div className="grid grid-cols-3 gap-2">
        <div className="w-8 h-8 bg-purple-200 rounded"></div>
        <div className="w-8 h-8 bg-purple-300 rounded"></div>
        <div className="w-8 h-8 bg-purple-200 rounded"></div>
        <div className="w-8 h-8 bg-purple-300 rounded"></div>
        <div className="w-8 h-8 bg-purple-200 rounded"></div>
        <div className="w-8 h-8 bg-purple-300 rounded"></div>
      </div>
    )
  },
  {
    id: 3,
    title: '专为小程序/APP创业者设计',
    subtitle: '覆盖主流创业场景',
    description: '无论是电商、工具、内容还是社交，我们都有针对性的模板和智能推荐。',
    icon: <Zap className="w-12 h-12 text-green-500" />,
    bgColor: 'bg-green-50',
    illustration: (
      <div className="flex space-x-1">
        <div className="w-6 h-6 bg-green-200 rounded"></div>
        <div className="w-6 h-6 bg-green-300 rounded"></div>
        <div className="w-6 h-6 bg-green-200 rounded"></div>
        <div className="w-6 h-6 bg-green-300 rounded"></div>
      </div>
    )
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { dispatch } = useProject();

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }

    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else if (e.key === 'Enter' && currentStep === onboardingSteps.length - 1) {
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleComplete = () => {
    // 跳转到行业选择页面，不再经过项目类型选择
    dispatch({ type: 'SET_STEP', payload: 'industry' });
    router.push('/industry');
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleDotClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部进度指示器 */}
      <div className="flex justify-center pt-8 px-4">
        <div className="flex space-x-2">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 主要内容 - 滑动容器 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4"
              style={{ width: '100vw', maxWidth: '100%' }}
            >
              <div className="max-w-lg w-full text-center">
                {/* 图标区域 */}
                <div className={`w-24 h-24 ${step.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
                  {step.icon}
                </div>

                {/* 标题区域 */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h1>

                <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">
                  {step.subtitle}
                </h2>

                {/* 描述 */}
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                  {step.description}
                </p>

                {/* 插图区域 */}
                <div className="flex justify-center mb-12">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    {step.illustration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-8 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-lg w-full mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* 跳过链接 */}
          {currentStep < onboardingSteps.length - 1 && (
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              跳过引导
            </button>
          )}

          {/* 开始创建按钮 */}
          <Button
            onClick={currentStep === onboardingSteps.length - 1 ? handleComplete : () => setCurrentStep(currentStep + 1)}
            className="w-full sm:w-auto px-8"
          >
            {currentStep === onboardingSteps.length - 1 ? '开始创建' : '下一步'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>

        {/* 滑动提示 */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            {currentStep < onboardingSteps.length - 1 ? '← 左右滑动切换页面 →' : '按 Enter 或点击按钮开始'}
          </p>
        </div>
      </div>
    </div>
  );
}