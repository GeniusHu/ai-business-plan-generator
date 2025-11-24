'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';
import { ChatMessage, ChatSession, ProductInfo } from '@/types';
import { Send, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { state, dispatch } = useProject();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({
    completeness: 0,
    missingAspects: [] as string[],
    recommendations: [] as string[],
    isReadyToGenerate: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  // 获取产品信息
  useEffect(() => {
    // 从localStorage恢复productInfo
    const saved = localStorage.getItem('productInfo');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setProductInfo(savedData);
      } catch (error) {
        console.error('Failed to load product info:', error);
      }
    }
  }, []);

  // 自动保存对话记录
  useEffect(() => {
    if (messages.length > 0) {
      const chatSession: ChatSession = {
        sessionId: `chat_${Date.now()}`,
        productInfo: productInfo!,
        messages,
        aiAnalysis,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('chatSession', JSON.stringify(chatSession));
    }
  }, [messages, aiAnalysis, productInfo]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始AI分析
  useEffect(() => {
    if (productInfo && messages.length === 0) {
      performAIAnalysis(productInfo);
    }
  }, [productInfo]);

  // 执行AI分析
  const performAIAnalysis = async (info: ProductInfo) => {
    setIsLoading(true);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟AI分析结果
      const analysis = {
        completeness: 65,
        missingAspects: [
          info.solution.trim() ? '' : '解决方案需要更详细',
          info.revenueModel.trim() ? '' : '盈利模式需要具体化',
          info.targetUsers.trim() ? '' : '用户痛点分析不够深入'
        ].filter(Boolean),
        recommendations: [
          '请详细说明你的产品如何解决用户的核心痛点',
          '建议分析你的盈利模式的可行性和竞争优势',
          '可以补充说明产品的技术实现方案和开发难度'
        ],
        isReadyToGenerate: false
      };

      setAiAnalysis(analysis);

      // 添加AI第一条消息
      const firstMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `你好！我已经分析了你的产品构思：

📊 **分析结果：**
- 完整度：${analysis.completenessity}%
- 需要补充：${analysis.missingAspects.join('、') || '暂无'}

💡 **建议：**
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

让我们开始深入探讨你的产品吧！请先告诉我，你觉得你的产品最核心的竞争优势是什么？`,
        timestamp: new Date().toISOString()
      };

      setMessages([firstMessage]);

    } catch (error) {
      console.error('AI分析失败:', error);

      // 失败时的备用消息
      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，分析过程中出现了问题。不过我们可以继续讨论你的产品构思。请告诉我，你的产品主要解决什么问题？',
        timestamp: new Date().toISOString()
      };
      setMessages([errorMessage]);

      setAiAnalysis({
        completeness: 50,
        missingAspects: ['需要更多信息'],
        recommendations: ['请详细描述产品功能'],
        isReadyToGenerate: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 模拟AI回复
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 生成AI回复（简单模拟）
      let aiResponse = '';
      const responses = [
        '这是个很有趣的想法！你能详细说明一下这个功能是如何实现的吗？',
        '很好！那么你的目标用户群体主要是哪些人？他们最看重产品的哪些特性？',
        '明白了。关于技术实现，你考虑过开发成本和时间周期吗？',
        '很好的补充！你觉得这个产品的市场前景如何？有考虑过竞争对手吗？',
        '不错的想法。你计划如何验证这个产品概念的可行性？'
      ];

      aiResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 更新AI分析（模拟改进）
      setAiAnalysis(prev => ({
        ...prev,
        completeness: Math.min(100, prev.completeness + 5),
        isReadyToGenerate: Math.random() > 0.7 // 随机模拟准备完成
      }));

    } catch (error) {
      console.error('发送消息失败:', error);

      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。让我们继续讨论你的产品吧！',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 导出功能
  const handleExport = () => {
    const exportData = {
      productInfo,
      chatHistory: messages,
      aiAnalysis,
      exportTime: new Date().toISOString()
    };

    // 创建下载
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `产品构思_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 生成商业计划
  const handleGenerate = () => {
    if (aiAnalysis.isReadyToGenerate) {
      // 保存最终数据
      dispatch({ type: 'UPDATE_PRODUCT_INFO', payload: { ...productInfo!, isCompleted: true } });

      // 跳转到生成页面
      router.push('/generating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🤖 AI产品顾问
            </h1>
            <p className="text-gray-600 mt-1">
              让我们深入探讨你的产品构思
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出记录
          </Button>
        </div>

        {/* AI分析结果 */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            AI分析结果
          </h2>

          <div className="space-y-4">
            {/* 完整度 */}
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">完整度</span>
                  <span className={`text-sm font-bold ${
                    aiAnalysis.completeness >= 80 ? 'text-green-600' :
                    aiAnalysis.completeness >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {aiAnalysis.completeness}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      aiAnalysis.completeness >= 80 ? 'bg-green-500' :
                      aiAnalysis.completeness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${aiAnalysis.completeness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 状态指示 */}
            <div className="flex items-center space-x-4">
              {aiAnalysis.isReadyToGenerate ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">信息充足，可以生成商业计划</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-600">
                  <Clock className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">需要更多信息以完善产品构思</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 对话区域 */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {/* 消息列表 */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                <p>AI正在分析你的产品构思...</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="输入你的想法或问题..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="flex items-center gap-2 self-end"
              >
                <Send className="w-4 h-4" />
                {isLoading ? '发送中...' : '发送'}
              </Button>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        {aiAnalysis.isReadyToGenerate && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              生成商业计划
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}