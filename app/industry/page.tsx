'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { ProductStepInput } from '@/components/steps/ProductStepInput';
import { useProject, createProject } from '@/contexts/ProjectContext';
import { industries, industryExamples } from '@/data/industries';
import { ProductInfo } from '@/types';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

// 步骤配置
const STEPS = [
  {
    id: 1,
    title: '产品描述',
    subtitle: '你的产品主要做什么？',
    placeholder: '详细描述你的产品功能、特点和核心价值...',
    field: 'productDescription' as keyof ProductInfo,
    icon: <span>📦</span>
  },
  {
    id: 2,
    title: '使用场景',
    subtitle: '在什么情况下使用？',
    placeholder: '描述用户在什么场景、什么时间、什么地点会使用你的产品...',
    field: 'usageScenario' as keyof ProductInfo,
    icon: <span>🎯</span>
  },
  {
    id: 3,
    title: '目标用户',
    subtitle: '什么样的用户会遇到什么样的问题？',
    placeholder: '详细描述你的目标用户群体、特征、以及他们面临的具体问题...',
    field: 'targetUsers' as keyof ProductInfo,
    icon: <span>👥</span>
  },
  {
    id: 4,
    title: '解决方案',
    subtitle: '我们怎么帮助解决他们的问题？',
    placeholder: '说明你的产品如何解决用户的问题，有什么独特优势...',
    field: 'solution' as keyof ProductInfo,
    icon: <span>💡</span>
  },
  {
    id: 5,
    title: '盈利模式',
    subtitle: '我们如何收费？',
    placeholder: '描述你的盈利方式、收费模式和商业变现策略...',
    field: 'revenueModel' as keyof ProductInfo,
    icon: <span>💰</span>
  }
];

export default function IndustryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useProject();

  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    industry: '',
    productDescription: '',
    usageScenario: '',
    targetUsers: '',
    solution: '',
    revenueModel: '',
    currentStep: 1,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // 从URL参数获取行业选择和localStorage恢复数据
  useEffect(() => {
    const industry = searchParams.get('industry');

    // 优先从URL参数获取行业
    if (industry) {
      setSelectedIndustry(industry);
      setProductInfo(prev => ({
        ...prev,
        industry,
        updatedAt: new Date().toISOString()
      }));
    } else {
      // 如果没有URL参数，尝试从localStorage恢复
      const saved = localStorage.getItem('productInfo');
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          if (savedData.industry) {
            setProductInfo(savedData);
            setSelectedIndustry(savedData.industry);
            setCurrentStep(savedData.currentStep || 1);
          }
        } catch (error) {
          console.error('Failed to load saved product info:', error);
        }
      }
    }
  }, [searchParams]);

  // 自动保存到localStorage
  useEffect(() => {
    if (selectedIndustry) {
      localStorage.setItem('productInfo', JSON.stringify(productInfo));
    }
  }, [productInfo, selectedIndustry]);

  // 获取当前步骤配置
  const currentStepConfig = STEPS.find(step => step.id === currentStep);

  // 获取当前步骤的示例
  const getCurrentStepExamples = () => {
    if (!selectedIndustry || !currentStepConfig) return [];

    const examples = industryExamples[selectedIndustry as keyof typeof industryExamples];
    if (!examples) return [];

    return examples[currentStepConfig.field as keyof typeof examples] || [];
  };

  // 更新当前步骤的值
  const updateStepValue = (value: string) => {
    setProductInfo(prev => ({
      ...prev,
      [currentStepConfig?.field || '']: value,
      updatedAt: new Date().toISOString()
    }));
  };

  // 保存草稿
  const saveDraft = () => {
    localStorage.setItem('productInfo', JSON.stringify(productInfo));
    // 可以添加保存成功提示
  };

  // 下一步
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setProductInfo(prev => ({
        ...prev,
        currentStep: currentStep + 1,
        updatedAt: new Date().toISOString()
      }));
    } else {
      handleComplete();
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProductInfo(prev => ({
        ...prev,
        currentStep: currentStep - 1,
        updatedAt: new Date().toISOString()
      }));
    }
  };

  // 完成
  const handleComplete = () => {
    const completedInfo: ProductInfo = {
      ...productInfo,
      currentStep: STEPS.length + 1,
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };

    // 创建项目数据
    const project = createProject(
      '未命名项目',
      'mini-program',
      selectedIndustry
    );

    // 更新项目状态
    dispatch({ type: 'INITIALIZE_PROJECT', payload: project });
    dispatch({ type: 'UPDATE_PRODUCT_INFO', payload: completedInfo });

    // 跳转到AI对话页面
    dispatch({ type: 'SET_STEP', payload: 'chat' });
    router.push('/chat');
  };

  // 检查当前步骤是否可以继续
  const canProceed = () => {
    if (!currentStepConfig) return false;
    const value = productInfo[currentStepConfig.field];
    return typeof value === 'string' && value.trim().length > 0;
  };

  // 如果还没选择行业，显示行业选择界面
  if (!selectedIndustry) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 高质量背景图片 */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop")`
            }}
          ></div>

          {/* 渐变遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/70 to-purple-900/80"></div>

          {/* 动态光效 */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 py-12 px-4">
          {/* 标题区域 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">🎯</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                选择你的行业领域
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              告诉我们你的产品属于哪个行业，我们将为你提供专业的示例和定制化的商业计划模板
            </p>
          </div>

          {/* 行业选择网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {industries.map((industry, index) => (
              <button
                key={industry.id}
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('industry', industry.id);
                  router.push(`/industry?${params.toString()}`);
                }}
                className={`group relative p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 text-left overflow-hidden ${
                  index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* 背景渐变 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* 内容 */}
                <div className="relative z-10">
                  {/* 图标 */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl">{industry.icon}</span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {industry.name}
                  </h3>

                  {/* 描述 */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {industry.description}
                  </p>

                  {/* 特性标签 */}
                  <div className="flex flex-wrap gap-2">
                    {industry.targetUsers.slice(0, 3).map((user, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                      >
                        {user}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 悬停指示器 */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* 底部提示 */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              💡 提示：选择最接近你产品行业的类别，AI将为你提供更精准的分析和建议
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 获取行业名称
  const industryName = industries.find(i => i.id === selectedIndustry)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-br from-yellow-200 to-green-200 rounded-full opacity-15 blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 py-8 px-4">
        {/* 头部信息 */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">{STEPS[currentStep - 1].icon}</span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  产品构思填写
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  正在完善你的 <span className="font-semibold text-blue-600">{industryName}</span> 项目
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-center">
                <p className="text-xs text-gray-500">当前步骤</p>
                <p className="text-lg font-bold text-gray-900">{currentStep}/{STEPS.length}</p>
              </div>
              <Button
                variant="outline"
                onClick={saveDraft}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 transition-all"
              >
                <Save className="w-4 h-4" />
                保存草稿
              </Button>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-6">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={STEPS.length}
              labels={STEPS.map(step => step.title)}
            />
          </div>
        </div>

        {/* 当前步骤输入 */}
        {currentStepConfig && (
          <ProductStepInput
            stepNumber={currentStepConfig.id}
            title={currentStepConfig.title}
            subtitle={currentStepConfig.subtitle}
            placeholder={currentStepConfig.placeholder}
            value={String(productInfo[currentStepConfig.field] || '')}
            onChange={updateStepValue}
            examples={getCurrentStepExamples()}
            icon={currentStepConfig.icon}
          />
        )}

        {/* 导航按钮 */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一步
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep} / {STEPS.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === STEPS.length ? '开始AI分析' : '下一步'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}