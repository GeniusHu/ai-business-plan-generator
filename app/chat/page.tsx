'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/contexts/ProjectContext';
import { ChatMessage, ChatSession, ProductInfo } from '@/types';
import { analyzeProductCompleteness, generateNextQuestion } from '@/lib/product-analysis';
import { Send, Download, CheckCircle, AlertCircle, Clock, Bot, Lightbulb } from 'lucide-react';

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
    // 首先尝试从industry页面获取新的商业想法数据
    const businessIdeaData = localStorage.getItem('currentBusinessIdea');
    if (businessIdeaData) {
      try {
        const { businessIdea, selectedSuggestion } = JSON.parse(businessIdeaData);

        // 创建兼容的ProductInfo数据结构
        const productInfoFromIdea = {
          industry: 'general',
          productDescription: selectedSuggestion.description,
          usageScenario: selectedSuggestion.scenario,
          targetUsers: selectedSuggestion.targetUsers,
          solution: `通过${selectedSuggestion.title}来解决用户的需求`,
          revenueModel: `定价策略：${selectedSuggestion.price}`,
          currentStep: 6,
          isCompleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setProductInfo(productInfoFromIdea);

        // 清理临时数据
        localStorage.removeItem('currentBusinessIdea');

        // 添加欢迎消息
        const welcomeMessage: ChatMessage = {
          id: `welcome_${Date.now()}`,
          role: 'assistant',
          content: `你好！我看到你对${selectedSuggestion.title}很有想法。让我来帮助你完善这个商业计划。\n\n你的想法是：${selectedSuggestion.description}\n\n我们可以一起讨论：\n• 目标用户的具体需求\n• 产品功能和特色\n• 盈利模式的细节\n• 市场竞争分析\n\n你有什么想了解的吗？`,
          timestamp: new Date().toISOString()
        };

        setMessages([welcomeMessage]);

      } catch (error) {
        console.error('Failed to load business idea data:', error);
      }
    }

    // 如果没有新的商业想法数据，使用旧的方式
    if (!productInfo) {
      const saved = localStorage.getItem('productInfo');
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          setProductInfo(savedData);
        } catch (error) {
          console.error('Failed to load product info:', error);
        }
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
      // 调用AI分析API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'AI分析失败');
      }

      const analysis = result.analysis;
      setAiAnalysis(analysis);

      // 添加AI第一条消息
      const firstMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `你好！我是你的AI产品顾问。我已经仔细分析了你的产品构思：

📊 **分析结果：**
- 完整度评分：${analysis.completeness}%
- 需要补充的方面：${analysis.missingAspects.length > 0 ? analysis.missingAspects.join('、') : '暂无'}

<Lightbulb className="w-5 h-5 inline mr-2 text-blue-500" /> **改进建议：**
${analysis.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

${analysis.isReadyToGenerate ?
  '✅ 你的产品构思已经相当完整，可以直接生成商业计划了！如果你觉得信息已经足够，可以点击下方按钮开始生成。' :
  '让我们通过对话来完善你的产品构思，让商业计划更加精准和实用。'
}

让我从最关键的问题开始：`,
        timestamp: new Date().toISOString()
      };

      setMessages([firstMessage]);

    } catch (error) {
      console.error('AI分析失败:', error);

      // 失败时的备用消息
      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，AI分析服务暂时不可用。不过我们可以继续完善你的产品构思。请告诉我，你的产品主要解决用户的什么问题？',
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
      // 获取对话历史
      const conversationHistory = messages
        .filter(m => m.role === 'user')
        .map(m => m.content);

      // 调用AI聊天API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productInfo: productInfo!,
          aiAnalysis,
          conversationHistory
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'AI回复失败');
      }

      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 更新AI分析（模拟改进）
      setAiAnalysis(prev => ({
        ...prev,
        completeness: Math.min(100, prev.completeness + 3), // 每次对话提升3%
        isReadyToGenerate: prev.completeness + 3 >= 80 // 基于完整度判断
      }));

    } catch (error) {
      console.error('AI回复失败:', error);

      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，AI服务暂时不可用。让我们继续讨论你的产品构思。你能详细说明一下产品的核心功能吗？',
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
    <div className="min-h-screen relative overflow-hidden">
      {/* 世界级AI对话页面背景 - 智能科技场景 */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop")`
          }}
        ></div>

        {/* 渐变遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/60 to-purple-900/70"></div>

        {/* 动态光效 */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-green-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 py-8 px-4">
        {/* 头部 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  AI产品顾问
                </h1>
                <p className="text-gray-600 mt-1">
                  让我们通过对话完善你的产品构思
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 transition-all"
            >
              <Download className="w-4 h-4" />
              导出记录
            </Button>
          </div>
        </div>

        {/* AI分析结果 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">📊</span>
            </div>
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* 消息列表 */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <div className="animate-spin inline-block w-8 h-8 border-3 border-white/30 border-t-white rounded-full"></div>
                </div>
                <p className="text-gray-600 font-medium">AI正在分析你的产品构思...</p>
                <p className="text-gray-500 text-sm mt-2">请稍候，我们正在为你生成专业的建议</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className={`max-w-xs lg:max-w-3xl px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {/* 发送者标识 */}
                    <div className="flex items-center mb-2">
                      {message.role === 'user' ? (
                        <span className="text-xs font-medium text-blue-100">你</span>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-600">AI顾问</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* 消息内容 */}
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>

                    {/* 时间戳 */}
                    <p className={`text-xs mt-3 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="描述你的想法，或者向AI询问任何关于产品的问题..."
                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="flex items-center gap-2 self-end px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                {isLoading ? '发送中...' : '发送'}
              </Button>
            </div>

            {/* 快捷输入提示 */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "我的竞争对手有哪些？",
                "如何验证市场需求？",
                "我的技术难度如何？",
                "盈利模式可行性？"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(suggestion)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <Lightbulb className="w-4 h-4 inline mr-2 text-blue-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        {aiAnalysis.isReadyToGenerate && (
          <div className="mt-8 text-center animate-bounce">
            <div className="inline-block p-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg">
              <Button
                onClick={handleGenerate}
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                生成专业商业计划
                <div className="inline-flex items-center ml-2">
                  <span className="text-green-500">→</span>
                  <span className="text-green-500 animate-pulse">→</span>
                </div>
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <CheckCircle className="w-5 h-5 inline mr-2 text-green-500" /> 你的产品构思已经完善，可以开始生成高质量商业计划了！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}