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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              你的产品属于哪个行业？
            </h1>
            <p className="text-lg text-gray-600">
              选择行业后，我们将为你提供针对性的示例和模板
            </p>
          </div>

          {/* 行业选择网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('industry', industry.id);
                  router.push(`/industry?${params.toString()}`);
                }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 获取行业名称
  const industryName = industries.find(i => i.id === selectedIndustry)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部信息 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              产品构思填写
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                行业：{industryName}
              </span>
              <Button
                variant="outline"
                onClick={saveDraft}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存草稿
              </Button>
            </div>
          </div>

          {/* 进度条 */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            labels={STEPS.map(step => step.title)}
          />
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