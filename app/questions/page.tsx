'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { useProject } from '@/contexts/ProjectContext';
import { ChevronLeft, ChevronRight, Lightbulb, Target, Zap, Settings, DollarSign } from 'lucide-react';
import { industries, revenueModels, mvpFeatures } from '@/data/industries';
import { CoreQuestions } from '@/types';
import { getRecommendations } from '@/lib/ai';

interface QuestionData {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: 'text' | 'multiselect' | 'tags' | 'single';
  field: keyof CoreQuestions;
  placeholder?: string;
  options?: Array<{ id: string; label: string; description?: string }>;
  examples?: string[];
}

const questions: QuestionData[] = [
  {
    id: 1,
    title: '你的产品主要做什么？',
    subtitle: '一句话描述',
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    type: 'text',
    field: 'productDescription',
    placeholder: '例如：帮助大学生找兼职的校园生活服务平台',
    examples: [
      '帮助大学生找兼职的校园生活服务平台',
      '为宝妈提供亲子活动推荐和攻略的社区',
      '让租房更透明的智能房源匹配工具'
    ]
  },
  {
    id: 2,
    title: '你的目标用户是谁？',
    subtitle: '选择或自定义',
    icon: <Target className="w-8 h-8 text-blue-500" />,
    type: 'multiselect',
    field: 'targetUsers'
  },
  {
    id: 3,
    title: '他们的核心痛点是什么？',
    subtitle: '选择主要痛点',
    icon: <Zap className="w-8 h-8 text-red-500" />,
    type: 'tags',
    field: 'painPoints'
  },
  {
    id: 4,
    title: '你希望MVP版本包含哪些功能？',
    subtitle: '选择核心功能（可选）',
    icon: <Settings className="w-8 h-8 text-purple-500" />,
    type: 'multiselect',
    field: 'mvpFeatures'
  },
  {
    id: 5,
    title: '你的盈利模式是什么？',
    subtitle: '选择主要盈利方式',
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    type: 'single',
    field: 'revenueModel'
  }
];

export default function QuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<CoreQuestions>({
    productDescription: '',
    targetUsers: [],
    painPoints: [],
    mvpFeatures: [],
    revenueModel: []
  });
  const [customTargetUser, setCustomTargetUser] = useState('');
  const [customPainPoint, setCustomPainPoint] = useState('');

  const router = useRouter();
  const { dispatch, state } = useProject();

  const currentQ = questions[currentQuestion];

  // 根据选择的行业获取目标用户选项
  const getTargetUserOptions = () => {
    const industry = state.projectData?.industry;
    if (industry && industries.find(i => i.id === industry)) {
      return industries.find(i => i.id === industry)?.targetUsers || [];
    }
    return ['大学生', '上班族', 'K12家长', '创业者', '商家', '自由职业者', '老师', '学生'];
  };

  // 根据选择的行业获取痛点选项
  const getPainPointOptions = () => {
    const industry = state.projectData?.industry;
    if (industry && industries.find(i => i.id === industry)) {
      return industries.find(i => i.id === industry)?.commonPainPoints || [];
    }
    return ['操作复杂', '成本过高', '效率低下', '信息不对称', '体验差', '功能不全'];
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // 保存答案
    dispatch({ type: 'UPDATE_QUESTIONS', payload: answers });
    dispatch({ type: 'SAVE_PROJECT' });

    // 跳转到生成页面
    dispatch({ type: 'SET_STEP', payload: 'generating' });
    router.push('/generating');
  };

  const updateAnswer = (field: keyof CoreQuestions, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: keyof CoreQuestions, value: string) => {
    const currentArray = answers[field] as string[];
    if (currentArray.includes(value)) {
      updateAnswer(field, currentArray.filter(item => item !== value));
    } else {
      updateAnswer(field, [...currentArray, value]);
    }
  };

  const addCustomItem = (field: 'targetUsers' | 'painPoints', value: string) => {
    if (value.trim()) {
      const currentArray = answers[field] as string[];
      updateAnswer(field, [...currentArray, value.trim()]);
      if (field === 'targetUsers') {
        setCustomTargetUser('');
      } else {
        setCustomPainPoint('');
      }
    }
  };

  const renderQuestionInput = () => {
    switch (currentQ.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              value={answers.productDescription}
              onChange={(e) => updateAnswer('productDescription', e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              autoFocus
            />

            {currentQ.examples && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">示例：</p>
                <div className="space-y-1">
                  {currentQ.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => updateAnswer('productDescription', example)}
                      className="block w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'multiselect':
        const options = currentQ.field === 'targetUsers'
          ? getTargetUserOptions()
          : currentQ.field === 'mvpFeatures'
          ? mvpFeatures.map(f => f.name)
          : [];

        return (
          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  (answers[currentQ.field] as string[]).includes(option)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(answers[currentQ.field] as string[]).includes(option)}
                  onChange={() => handleMultiSelect(currentQ.field, option)}
                  className="mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}

            {/* 自定义输入 */}
            {currentQ.field === 'targetUsers' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTargetUser}
                  onChange={(e) => setCustomTargetUser(e.target.value)}
                  placeholder="自定义用户群体"
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('targetUsers', customTargetUser)}
                />
                <Button
                  onClick={() => addCustomItem('targetUsers', customTargetUser)}
                  disabled={!customTargetUser.trim()}
                >
                  添加
                </Button>
              </div>
            )}
          </div>
        );

      case 'tags':
        const painPointOptions = getPainPointOptions();
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {painPointOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('painPoints', option)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    (answers[currentQ.field] as string[]).includes(option)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 自定义痛点输入 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customPainPoint}
                onChange={(e) => setCustomPainPoint(e.target.value)}
                placeholder="自定义痛点"
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem('painPoints', customPainPoint)}
              />
              <Button
                onClick={() => addCustomItem('painPoints', customPainPoint)}
                disabled={!customPainPoint.trim()}
                variant="outline"
              >
                添加
              </Button>
            </div>
          </div>
        );

      case 'single':
        return (
          <div className="space-y-3">
            {revenueModels.map((model) => (
              <label
                key={model.id}
                className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                  (answers[currentQ.field] as string[]).includes(model.name)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="revenue"
                  checked={(answers[currentQ.field] as string[]).includes(model.name)}
                  onChange={() => updateAnswer('revenueModel', [model.name])}
                  className="mr-3 mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{model.name}</div>
                  <div className="text-sm text-gray-600">{model.description}</div>
                </div>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentQ.field) {
      case 'productDescription':
        return answers.productDescription.trim().length > 0;
      case 'targetUsers':
        return answers.targetUsers.length > 0;
      case 'painPoints':
        return answers.painPoints.length > 0;
      case 'mvpFeatures':
        return true; // 可选
      case 'revenueModel':
        return answers.revenueModel.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 进度条 */}
        <ProgressBar
          currentStep={currentQuestion + 1}
          totalSteps={questions.length}
          labels={questions.map(q => `问题${q.id}`)}
        />

        {/* 问题卡片 */}
        <div className="mt-8 border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              {currentQ.icon}
              <h1 className="text-2xl font-bold text-gray-900 ml-3">
                {currentQ.title}
              </h1>
            </div>
            <p className="text-gray-600">{currentQ.subtitle}</p>
          </div>

          <div>
            {renderQuestionInput()}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            上一步
          </Button>

          <div className="text-sm text-gray-600">
            {currentQuestion + 1} / {questions.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentQuestion === questions.length - 1 ? '生成商业计划' : '下一步'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}