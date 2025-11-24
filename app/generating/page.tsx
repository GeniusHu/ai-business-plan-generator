'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { BusinessModelCanvas } from '@/types';
import { generateBusinessCanvas } from '@/lib/ai';

interface GeneratingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'generating' | 'completed';
  icon: string;
}

const generatingSteps: GeneratingStep[] = [
  {
    id: 1,
    title: '分析产品信息',
    description: '理解你的产品定位和目标用户',
    status: 'pending',
    icon: '🔍'
  },
  {
    id: 2,
    title: '生成客户细分',
    description: '识别核心用户群体特征',
    status: 'pending',
    icon: '👥'
  },
  {
    id: 3,
    title: '设计价值主张',
    description: '提炼产品核心竞争优势',
    status: 'pending',
    icon: '💎'
  },
  {
    id: 4,
    title: '规划核心功能',
    description: '设计MVP版本功能架构',
    status: 'pending',
    icon: '⚙️'
  },
  {
    id: 5,
    title: '制定盈利模式',
    description: '设计可持续的商业变现方式',
    status: 'pending',
    icon: '💰'
  },
  {
    id: 6,
    title: '生成完整计划',
    description: '构建商业模式画布',
    status: 'pending',
    icon: '📊'
  }
];

export default function GeneratingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useProject();

  useEffect(() => {
    // 真实的AI生成过程
    const generateWithAI = async () => {
      if (!state.projectData?.questions) {
        console.error('No questions data found');
        return;
      }

      try {
        // 设置生成状态
        dispatch({ type: 'SET_GENERATING', payload: true });

        // 步骤1: 分析产品信息
        setCurrentStep(0);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤2-5: 模拟中间步骤
        for (let i = 1; i < 5; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 步骤6: 调用豆包AI生成商业模式画布
        setCurrentStep(5);
        const { questions } = state.projectData;

        const aiResponse = await generateBusinessCanvas(
          questions.productDescription,
          questions.targetUsers,
          questions.painPoints,
          questions.mvpFeatures,
          questions.revenueModel
        );

        if (aiResponse.success && aiResponse.content) {
          // 解析AI返回的JSON数据
          let canvasData: BusinessModelCanvas;
          try {
            canvasData = JSON.parse(aiResponse.content);
          } catch (parseError) {
            console.warn('Failed to parse AI response, using fallback:', parseError);
            // 如果解析失败，使用备用逻辑
            canvasData = generateBusinessModelCanvas();
          }

          console.log('AI Generated canvas data:', canvasData);

          // 更新状态
          dispatch({ type: 'UPDATE_CANVAS', payload: canvasData });
          dispatch({ type: 'SAVE_PROJECT' });

          setIsComplete(true);

          // 2秒后跳转到画布页面
          setTimeout(() => {
            dispatch({ type: 'SET_STEP', payload: 'canvas' });
            router.push('/canvas');
          }, 2000);
        } else {
          throw new Error(aiResponse.error || 'AI生成失败');
        }

      } catch (error) {
        console.error('AI生成失败:', error);

        // AI失败时使用备用逻辑
        console.log('使用备用生成逻辑');
        const canvasData = generateBusinessModelCanvas();
        dispatch({ type: 'UPDATE_CANVAS', payload: canvasData });
        dispatch({ type: 'SAVE_PROJECT' });

        setIsComplete(true);

        setTimeout(() => {
          dispatch({ type: 'SET_STEP', payload: 'canvas' });
          router.push('/canvas');
        }, 2000);
      } finally {
        dispatch({ type: 'SET_GENERATING', payload: false });
      }
    };

    generateWithAI();
  }, [dispatch, router, state.projectData]);

  // 模拟生成商业模式画布数据
  const generateBusinessModelCanvas = (): BusinessModelCanvas => {
    const { questions, industry } = state.projectData || {};

    // 添加调试信息
    console.log('Generating canvas with data:', {
      projectData: state.projectData,
      questions,
      industry
    });

    // 确保有questions数据，如果没有则使用默认值
    const safeQuestions = questions || {
      productDescription: '创新产品',
      targetUsers: ['目标用户群体'],
      painPoints: ['用户痛点'],
      mvpFeatures: ['核心功能'],
      revenueModel: ['盈利模式']
    };

    return {
      valueProposition: [
        `为${safeQuestions.targetUsers.join('、')}提供${safeQuestions.productDescription}`,
        '简单易用的用户体验',
        '个性化的功能定制',
        '高性价比的解决方案'
      ].filter(Boolean),

      customerSegments: safeQuestions.targetUsers,

      channels: [
        '微信小程序',
        '社交媒体推广',
        '口碑传播',
        '应用商店优化',
        '合作伙伴渠道'
      ],

      keyFeatures: safeQuestions.mvpFeatures && safeQuestions.mvpFeatures.length > 0
        ? safeQuestions.mvpFeatures
        : [
            '用户注册登录',
            '核心功能模块',
            '个人中心',
            '搜索功能',
            '消息通知'
          ],

      costStructure: [
        '技术研发成本',
        '服务器和基础设施',
        '市场推广费用',
        '运营人员成本',
        '客户服务成本'
      ],

      revenueStreams: safeQuestions.revenueModel.length > 0 ? safeQuestions.revenueModel : ['广告收入', '增值服务']
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI正在生成你的商业计划
          </h1>
          <p className="text-lg text-gray-600">
            基于你的回答，我们正在为你构建专业的商业模式画布
          </p>
        </div>

        {/* 生成动画区域 */}
        <div className="relative mb-12">
          {/* 中心Logo */}
          <div className="flex justify-center mb-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
              isComplete
                ? 'bg-green-500'
                : 'bg-blue-500 animate-pulse'
            }`}>
              <span className="text-3xl font-bold text-white">
                {isComplete ? '✓' : 'AI'}
              </span>
            </div>
          </div>

          {/* 节点动画 */}
          <div className="relative h-32 flex items-center justify-center">
            {generatingSteps.map((step, index) => {
              const angle = (index * 360) / generatingSteps.length;
              const radius = 100;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={step.id}
                  className="absolute transition-all duration-500"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    opacity: index <= currentStep ? 1 : 0.3
                  }}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-md transition-all duration-500 ${
                    index < currentStep
                      ? 'bg-green-100 border-2 border-green-500'
                      : index === currentStep
                      ? 'bg-blue-100 border-2 border-blue-500 animate-bounce'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {step.icon}
                  </div>
                </div>
              );
            })}

            {/* 连接线 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {generatingSteps.map((_, index) => {
                const angle = (index * 360) / generatingSteps.length;
                const nextAngle = ((index + 1) * 360) / generatingSteps.length;
                const radius = 100;

                const x1 = Math.cos((angle * Math.PI) / 180) * radius + 128;
                const y1 = Math.sin((angle * Math.PI) / 180) * radius + 64;
                const x2 = Math.cos((nextAngle * Math.PI) / 180) * radius + 128;
                const y2 = Math.sin((nextAngle * Math.PI) / 180) * radius + 64;

                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={index < currentStep ? '#10b981' : '#e5e7eb'}
                    strokeWidth="2"
                    strokeDasharray={index === currentStep ? '4 2' : 'none'}
                    className={index === currentStep ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* 步骤进度列表 */}
        <div className="space-y-3 mb-8">
          {generatingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${
                index < currentStep
                  ? 'border-green-200 bg-green-50'
                  : index === currentStep
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {index < currentStep ? '✓' : step.id}
              </div>

              <div className="flex-1">
                <h3 className={`font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>

              {index === currentStep && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 完成提示 */}
        {isComplete && (
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="text-green-600 text-lg font-semibold mb-2">
              🎉 商业计划生成完成！
            </div>
            <p className="text-gray-600">
              正在跳转到画布编辑器...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}