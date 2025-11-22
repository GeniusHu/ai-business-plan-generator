'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { Edit3, Save, ArrowRight, Download, Eye } from 'lucide-react';
import { BusinessModelCanvas } from '@/types';

interface CanvasCell {
  id: string;
  title: string;
  field: keyof BusinessModelCanvas;
  color: string;
  position: 'left' | 'center' | 'right';
}

const canvasCells: CanvasCell[] = [
  // 左侧区域
  { id: 'customers', title: '客户细分', field: 'customerSegments', color: 'bg-blue-100 border-blue-300', position: 'left' },
  { id: 'problems', title: '用户痛点', field: 'costStructure', color: 'bg-red-100 border-red-300', position: 'left' },

  // 中间区域
  { id: 'value', title: '价值主张', field: 'valueProposition', color: 'bg-yellow-100 border-yellow-300', position: 'center' },
  { id: 'features', title: '核心功能', field: 'keyFeatures', color: 'bg-purple-100 border-purple-300', position: 'center' },

  // 右侧区域
  { id: 'revenue', title: '收入来源', field: 'revenueStreams', color: 'bg-green-100 border-green-300', position: 'right' },
  { id: 'channels', title: '渠道通路', field: 'channels', color: 'bg-indigo-100 border-indigo-300', position: 'right' }
];

export default function CanvasPage() {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useProject();

  // 添加调试信息
  console.log('Canvas page - state:', state);
  console.log('Canvas page - projectData:', state.projectData);
  console.log('Canvas page - canvas:', state.projectData?.canvas);

  const canvas = state.projectData?.canvas;

  // 如果没有canvas数据，生成fallback数据
  useEffect(() => {
    if (!canvas && !isInitializing) {
      setIsInitializing(true);

      // 尝试直接生成canvas数据
      const { questions, industry } = state.projectData || {};
      const fallbackCanvas = {
        valueProposition: [
          `为${questions?.targetUsers?.join('、') || '目标用户'}提供${questions?.productDescription || '创新产品'}`,
          '简单易用的用户体验',
          '个性化的功能定制',
          '高性价比的解决方案'
        ].filter(Boolean),
        customerSegments: questions?.targetUsers || ['目标用户群体'],
        channels: [
          '微信小程序',
          '社交媒体推广',
          '口碑传播',
          '应用商店优化',
          '合作伙伴渠道'
        ],
        keyFeatures: questions?.mvpFeatures && questions.mvpFeatures.length > 0
          ? questions.mvpFeatures
          : ['用户注册登录', '核心功能模块', '个人中心', '搜索功能'],
        costStructure: [
          '技术研发成本',
          '服务器和基础设施',
          '市场推广费用',
          '运营人员成本',
          '客户服务成本'
        ],
        revenueStreams: questions?.revenueModel?.length > 0 ? questions.revenueModel : ['广告收入', '增值服务']
      };

      console.log('Using fallback canvas data:', fallbackCanvas);

      // 更新状态
      dispatch({ type: 'UPDATE_CANVAS', payload: fallbackCanvas });
      dispatch({ type: 'SAVE_PROJECT' });

      // 2秒后标记初始化完成
      setTimeout(() => {
        setIsInitializing(false);
      }, 2000);
    }
  }, [canvas, isInitializing, state.projectData, dispatch]);

  // 如果正在初始化，显示加载状态
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">正在初始化画布...</h2>
            <p className="text-gray-600">正在为您生成默认的商业模式画布数据</p>
          </div>
        </div>
      </div>
    );
  }

  
  const handleCellClick = (cell: CanvasCell) => {
    const content = canvas[cell.field].join('\\n');
    setEditContent(content);
    setEditingCell(cell.id);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingCell) return;

    const cell = canvasCells.find(c => c.id === editingCell);
    if (!cell) return;

    const updatedContent = editContent
      .split('\\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const updatedCanvas = {
      ...canvas,
      [cell.field]: updatedContent
    };

    dispatch({ type: 'UPDATE_CANVAS', payload: updatedCanvas });
    dispatch({ type: 'SAVE_PROJECT' });

    setEditingCell(null);
    setIsEditing(false);
    setEditContent('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setIsEditing(false);
    setEditContent('');
  };

  const handlePreview = () => {
    router.push('/preview');
  };

  const renderCanvasContent = (cell: CanvasCell) => {
    const content = canvas[cell.field];
    if (content.length === 0) {
      return (
        <div className="text-gray-400 text-center">
          <Edit3 className="w-8 h-8 mx-auto mb-2" />
          <p>点击编辑</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {content.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="w-2 h-2 bg-current rounded-full mt-2 mr-2 opacity-60"></div>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            商业模式画布
          </h1>
          <p className="text-gray-600">
            点击任意模块进行编辑，AI会为你提供实时优化建议
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={handlePreview} variant="outline">
            <Eye className="w-5 h-5 mr-2" />
            预览报告
          </Button>

          <Button onClick={() => router.push('/export')} variant="outline">
            <Download className="w-5 h-5 mr-2" />
            导出报告
          </Button>

          <Button onClick={() => router.push('/profile')} variant="outline">
            <Save className="w-5 h-5 mr-2" />
            保存项目
          </Button>
        </div>

        {/* 九宫格画布 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {canvasCells.map((cell) => (
            <div
              key={cell.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${cell.color} border-2 rounded-xl p-6 ${
                editingCell === cell.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => handleCellClick(cell)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{cell.title}</h3>
                <Edit3 className="w-5 h-5 text-gray-500" />
              </div>

              <div>
                {renderCanvasContent(cell)}
              </div>
            </div>
          ))}
        </div>

        {/* 底部操作 */}
        <div className="text-center">
          <Button onClick={handlePreview} size="lg">
            下一步：生成计划书
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <h3 className="text-xl font-bold text-gray-900">
                编辑 {canvasCells.find(c => c.id === editingCell)?.title}
              </h3>
              <p className="text-gray-600">
                每行输入一个要点，AI会根据你的输入提供优化建议
              </p>
            </CardHeader>

            <CardContent>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="请输入内容，每行一个要点..."
                autoFocus
              />

              {/* AI建议区域（简化版，后续集成） */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <span className="font-medium text-blue-900">智能建议</span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 建议用具体的数字和数据支持你的观点</li>
                  <li>• 考虑用户痛点的紧迫性和频率</li>
                  <li>• 确保价值主张与用户痛点匹配</li>
                </ul>
              </div>
            </CardContent>

            {/* 弹窗按钮 */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存修改
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}