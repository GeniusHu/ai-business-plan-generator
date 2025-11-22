'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { ChevronRight, Info } from 'lucide-react';
import { industries } from '@/data/industries';

export default function IndustryPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch, state } = useProject();

  const handleSelect = (industryId: string) => {
    setSelectedIndustry(industryId);
  };

  const handleNext = () => {
    if (!selectedIndustry) return;

    // 更新项目数据中的行业信息
    if (state.projectData) {
      const updatedProject = {
        ...state.projectData,
        industry: selectedIndustry
      };
      dispatch({ type: 'INITIALIZE_PROJECT', payload: updatedProject });
    }

    dispatch({ type: 'SET_STEP', payload: 'questions' });
    router.push('/questions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            你的产品属于哪个行业？
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            选择行业后，AI会自动选择对应的模板，为你提供更精准的商业计划建议
          </p>
        </div>

        {/* 九宫格行业选择 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md p-4 border-2 border-gray-200 rounded-xl ${
                selectedIndustry === industry.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleSelect(industry.id)}
            >
              <div className="text-center">
                {/* 图标 */}
                <div className="text-4xl mb-3">{industry.icon}</div>

                {/* 名称 */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {industry.name}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-gray-600 mb-3">
                  {industry.description}
                </p>

                {/* 选中指示器 */}
                {selectedIndustry === industry.id && (
                  <div className="flex justify-center mt-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 选中行业的详细信息 */}
        {selectedIndustry && (
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {industries.find(i => i.id === selectedIndustry)?.icon}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {industries.find(i => i.id === selectedIndustry)?.name}行业模板
                </h3>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">目标用户</h4>
                  <div className="space-y-1">
                    {industries.find(i => i.id === selectedIndustry)?.targetUsers.map((user, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {user}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">常见痛点</h4>
                  <div className="space-y-1">
                    {industries.find(i => i.id === selectedIndustry)?.commonPainPoints.slice(0, 3).map((point, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">典型功能</h4>
                  <div className="space-y-1">
                    {industries.find(i => i.id === selectedIndustry)?.typicalFeatures.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">盈利模式</h4>
                  <div className="space-y-1">
                    {industries.find(i => i.id === selectedIndustry)?.revenueModels.slice(0, 3).map((model, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 底部按钮 */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/project-type')}
          >
            上一步
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedIndustry}
            className="px-8"
          >
            下一步
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>

        {/* 模板说明按钮 */}
        <div className="flex justify-center mt-6">
          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <Info className="w-4 h-4 mr-1" />
            模板说明
          </button>
        </div>
      </div>
    </div>
  );
}