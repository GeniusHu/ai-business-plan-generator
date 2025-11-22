'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject, createProject } from '@/contexts/ProjectContext';
import { ChevronRight, Smartphone, Monitor, Layers } from 'lucide-react';
import { projectTypes } from '@/data/industries';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case '🟦':
      return <Smartphone className="w-12 h-12 text-blue-500" />;
    case '🟧':
      return <Monitor className="w-12 h-12 text-orange-500" />;
    case '🟪':
      return <Layers className="w-12 h-12 text-purple-500" />;
    default:
      return <Smartphone className="w-12 h-12 text-gray-500" />;
  }
};

export default function ProjectTypePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch, state } = useProject();

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (!selectedType) return;

    // 创建临时项目数据
    const tempProject = createProject(
      '未命名项目',
      selectedType,
      'unknown' // 待选择行业
    );

    dispatch({ type: 'INITIALIZE_PROJECT', payload: tempProject });
    dispatch({ type: 'SET_STEP', payload: 'industry' });
    router.push('/industry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            你想做哪种产品？
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            选择最适合你的产品类型，我们将为你提供针对性的商业计划模板
          </p>
        </div>

        {/* 项目类型卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {projectTypes.map((type) => (
            <div
              key={type.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 rounded-xl p-6 ${
                selectedType === type.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:border-gray-300 border-gray-200'
              }`}
              onClick={() => handleSelect(type.id)}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  {getIcon(type.icon)}
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">优势特点：</p>
                {type.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {advantage}
                  </div>
                ))}
              </div>

              {selectedType === type.id && (
                <div className="mt-6 flex justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding')}
          >
            上一步
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedType}
            className="px-8"
          >
            下一步
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}