'use client';

import { useState } from 'react';
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
  const router = useRouter();
  const { dispatch } = useProject();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'SET_STEP', payload: 'project-type' });
    router.push('/project-type');
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* 顶部进度条 */}
      <div className="flex justify-center pt-8 px-4">
        <div className="flex space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* 图标区域 */}
          <div className={`w-24 h-24 ${currentData.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
            {currentData.icon}
          </div>

          {/* 标题区域 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {currentData.title}
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">
            {currentData.subtitle}
          </h2>

          {/* 描述 */}
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            {currentData.description}
          </p>

          {/* 插图区域 */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              {currentData.illustration}
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-8">
        <div className="max-w-lg w-full mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          {/* 返回按钮 - 除第一步外都显示 */}
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="w-full sm:w-auto"
            >
              上一步
            </Button>
          )}

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
            onClick={handleNext}
            className="w-full sm:w-auto px-8"
          >
            {currentStep === onboardingSteps.length - 1 ? '开始创建' : '下一步'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}