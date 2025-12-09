'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useProject, createProject} from '@/contexts/ProjectContext';
import {BusinessIdea, AISuggestion, BusinessScenario} from '@/types';
import {BusinessIdeaInput} from '@/components/steps/BusinessIdeaInput';
import {WorldClassScenarioCards} from '@/components/steps/WorldClassScenarioCards';
import {aiClientService, AIAnalysisRequest} from '@/services/aiClientService';

/**
 * 通过API调用豆包AI进行世界级商业分析
 */
async function analyzeBusinessIdea(idea: BusinessIdea): Promise<AISuggestion[]> {
    try {
        // 构建AI分析请求
        const request: AIAnalysisRequest = {
            targetUsers: idea.targetUsers && idea.targetUsers !== 'not_sure' ? idea.targetUsers : undefined,
            scenario: idea.scenario && idea.scenario !== 'not_sure' ? idea.scenario : undefined,
            price: idea.price && idea.price !== 'not_sure' ? idea.price : undefined,
            coreNeed: idea.coreNeed
        };

        // 通过API调用豆包AI进行深度分析
        const response = await aiClientService.analyzeBusinessIdea(request);

        // 检查分析是否成功
        if (!response.success) {
            if (response.errorCode === 'INSUFFICIENT_INPUT') {
                throw new Error(`${response.message}${response.suggestion ? '\n建议：' + response.suggestion : ''}`);
            }
            throw new Error(response.message || 'AI分析失败');
        }

        // 将响应转换为建议格式（兼容现有UI）
        if (!response.suggestions) {
            throw new Error('AI分析返回空结果');
        }

        return response.suggestions.map((suggestion: any) => ({
            id: suggestion.id,
            title: suggestion.title,
            description: suggestion.description,
            targetUsers: suggestion.targetUsers,
            scenario: suggestion.scenario,
            price: suggestion.price,
            score: suggestion.score,
            // 扩展数据，用于后续使用
            marketPotential: suggestion.marketPotential,
            competitionLevel: suggestion.competitionLevel,
            executionDifficulty: suggestion.executionDifficulty,
            keyAdvantages: suggestion.keyAdvantages,
            potentialRisks: suggestion.potentialRisks,
            estimatedMarketSize: suggestion.estimatedMarketSize
        }));

    } catch (error) {
        console.error('AI分析API调用失败:', error);

        // 降级处理：提供基础的智能分析
        const hasTargetUsers = idea.targetUsers && idea.targetUsers !== 'not_sure';
        const hasScenario = idea.scenario && idea.scenario !== 'not_sure';
        const hasPrice = idea.price && idea.price !== 'not_sure';

        if (hasTargetUsers && hasScenario && hasPrice) {
            return [{
                id: 'fallback_1',
                title: `${idea.targetUsers}专项解决方案`,
                description: `基于您的需求分析，针对${idea.targetUsers}在${idea.scenario}时的需求，提供${idea.price}价位的解决方案。这个想法具有很好的市场潜力，建议进一步完善商业模式设计。`,
                targetUsers: idea.targetUsers,
                scenario: idea.scenario,
                price: idea.price,
                score: 75,
                marketPotential: 7,
                competitionLevel: 6,
                executionDifficulty: 5,
                keyAdvantages: ['针对性强', '需求明确', '价格合理'],
                potentialRisks: ['市场竞争', '用户获取成本', '服务品质保证'],
                estimatedMarketSize: '待详细分析'
            }];
        }

        // 返回通用建议，鼓励用户提供更多信息
        return [{
            id: 'fallback_general',
            title: '通用商业机会分析',
            description: '基于您的核心需求，我们识别出一个有潜力的商业机会。建议提供更多关于目标用户、使用场景和定价策略的信息，以便我们进行更精准的商业分析。',
            targetUsers: hasTargetUsers ? idea.targetUsers : '待进一步明确',
            scenario: hasScenario ? idea.scenario : '待进一步明确',
            price: hasPrice ? idea.price : '待进一步明确',
            score: 60,
            marketPotential: 5,
            competitionLevel: 5,
            executionDifficulty: 6,
            keyAdvantages: ['需求明确', '市场机会'],
            potentialRisks: ['信息不充分', '执行风险'],
            estimatedMarketSize: '待详细分析'
        }];
    }
}

export default function IndustryPage() {
    const router = useRouter();
    const {dispatch} = useProject();

    // 页面状态
    const [currentPage, setCurrentPage] = useState<'input' | 'suggestions'>('input');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 商业想法状态
    const [businessIdea, setBusinessIdea] = useState<BusinessIdea>({
        targetUsers: 'not_sure',
        scenario: 'not_sure',
        price: 'not_sure',
        coreNeed: '',
        isAnalyzed: false
    });

    // AI建议状态
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<number | undefined>();

    // 从localStorage恢复数据
    useEffect(() => {
        const saved = localStorage.getItem('businessIdea');
        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                setBusinessIdea(savedData);
                if (savedData.isAnalyzed && savedData.aiSuggestions) {
                    setAiSuggestions(savedData.aiSuggestions);
                    setSelectedSuggestion(savedData.selectedSuggestion);
                    setCurrentPage('suggestions');
                }
            } catch (error) {
                console.error('Failed to load saved business idea:', error);
            }
        }
    }, []);

    // 自动保存到localStorage
    useEffect(() => {
        localStorage.setItem('businessIdea', JSON.stringify({
            ...businessIdea,
            aiSuggestions,
            selectedSuggestion
        }));
    }, [businessIdea, aiSuggestions, selectedSuggestion]);

    // 处理AI分析
    const handleAnalyze = async () => {
        if (!businessIdea.coreNeed.trim()) {
            return;
        }

        setIsAnalyzing(true);
        try {
            const suggestions = await analyzeBusinessIdea(businessIdea);
            setAiSuggestions(suggestions);
            setBusinessIdea(prev => ({
                ...prev,
                isAnalyzed: true,
                aiSuggestions: suggestions
            }));
            setCurrentPage('suggestions');
        } catch (error) {
            console.error('AI分析失败:', error);
            // 可以添加错误提示
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 选择建议
    const handleSelectSuggestion = (index: number) => {
        setSelectedSuggestion(index);
        setBusinessIdea(prev => ({
            ...prev,
            selectedSuggestion: index
        }));
    };

    // 生成深度分析报告并展示
    const handleGenerateReport = async () => {
        if (selectedSuggestion === undefined || !aiSuggestions[selectedSuggestion]) {
            console.log('❌ 没有选择建议或建议不存在');
            return;
        }

        const selected = aiSuggestions[selectedSuggestion];
        console.log('🚀 开始生成深度分析报告');
        console.log('📋 选中的建议:', selected);
        console.log('💭 原始商业想法:', businessIdea);

        // 生成深度分析报告
        const aiRequest: AIAnalysisRequest = {
            targetUsers: businessIdea.targetUsers && businessIdea.targetUsers !== 'not_sure' ? businessIdea.targetUsers : undefined,
            scenario: businessIdea.scenario && businessIdea.scenario !== 'not_sure' ? businessIdea.scenario : undefined,
            price: businessIdea.price && businessIdea.price !== 'not_sure' ? businessIdea.price : undefined,
            coreNeed: businessIdea.coreNeed
        };

        console.log('📤 AI分析请求:', aiRequest);

        try {
            setIsAnalyzing(true);
            console.log('⏳ 开始调用AI生成报告...');

            // 构建商业场景对象
            const scenario: BusinessScenario = {
                id: selected.id,
                title: selected.title,
                description: selected.description.split('\n\n')[0], // 提取主要描述
                targetUsers: selected.targetUsers,
                scenario: selected.scenario,
                price: selected.price,
                marketPotential: selected.marketPotential || 5,
                competitionLevel: selected.competitionLevel || 5,
                executionDifficulty: selected.executionDifficulty || 5,
                keyAdvantages: selected.keyAdvantages || ['优势1', '优势2'],
                potentialRisks: selected.potentialRisks || ['风险1', '风险2'],
                estimatedMarketSize: selected.estimatedMarketSize || '待分析',
                confidence: selected.confidence
            };

            console.log('🏗️ 构建的商业场景:', scenario);

            // 生成详细分析报告
            console.log('🤖 调用aiClientService.generateReport...');
            const response = await aiClientService.generateReport(scenario, aiRequest);
            console.log('📊 报告生成响应:', response);
            const report = response.report;

            // 创建项目数据
            console.log('🏢 创建项目数据...');
            const project = createProject(
                selected.title,
                'mini-program',
                'general'
            );

            // 更新项目状态
            console.log('📋 更新项目状态...');
            dispatch({type: 'INITIALIZE_PROJECT', payload: project});
            dispatch({type: 'SET_STEP', payload: 'report'});

            // 保存分析报告到localStorage
            console.log('💾 保存分析报告到localStorage...');
            const reportData = {
                scenario,
                report,
                businessIdea,
                generatedAt: new Date().toISOString()
            };
            localStorage.setItem('preliminaryReport', JSON.stringify(reportData));
            console.log('✅ 报告数据已保存:', reportData);

            // 跳转到报告展示页面
            console.log('🔄 跳转到报告展示页面 /report');
            router.push('/report');

        } catch (error) {
            console.error('💥 生成报告失败，错误详情:', error);
            console.error('❌ 错误类型:', error.constructor.name);
            console.error('❌ 错误消息:', error.message);

            // 如果报告生成失败，直接跳转到chat作为降级方案
            console.log('🚑 执行降级方案，跳转到chat');
            handleFallbackToChat();
        } finally {
            console.log('🏁 报告生成流程结束');
            setIsAnalyzing(false);
        }
    };

    // 降级方案：直接跳转到chat
    const handleFallbackToChat = () => {
        console.log('🚑 执行降级方案，准备跳转到chat页面');
        const selected = aiSuggestions[selectedSuggestion];

        console.log('📋 为chat准备项目数据...');
        const project = createProject(
            selected.title,
            'mini-program',
            'general'
        );

        const productInfo = {
            industry: 'general',
            productDescription: selected.description,
            usageScenario: selected.scenario,
            targetUsers: selected.targetUsers,
            solution: `通过${selected.title}来解决用户的需求`,
            revenueModel: `定价策略：${selected.price}`,
            currentStep: 6,
            isCompleted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('💾 保存chat相关数据到localStorage...');
        localStorage.setItem('currentBusinessIdea', JSON.stringify({
            businessIdea,
            selectedSuggestion: selected
        }));

        console.log('📋 更新项目状态...');
        dispatch({type: 'INITIALIZE_PROJECT', payload: project});
        dispatch({type: 'UPDATE_PRODUCT_INFO', payload: productInfo});
        dispatch({type: 'SET_STEP', payload: 'chat'});

        console.log('🔄 跳转到chat页面 /chat');
        router.push('/chat');
    };

    // 重新分析
    const handleRetry = () => {
        setCurrentPage('input');
        setSelectedSuggestion(undefined);
        setAiSuggestions([]);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 好莱坞级背景系统 - 多层次视觉效果 */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1554250650-12d507a97826?q=80&w=2940&auto=format&fit=crop")`
                    }}
                ></div>

                {/* 多层高级渐变遮罩 */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/60 to-indigo-900/80"></div>
                    <div
                        className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-transparent to-indigo-900/30"></div>
                    <div
                        className="absolute inset-0 bg-gradient-to-bl from-teal-900/30 via-transparent to-blue-900/20"></div>
                </div>

                {/* 电影级动态光效系统 */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* 主光源 - 温暖金色光芒 */}
                    <div
                        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-amber-400/15 via-orange-500/10 to-transparent rounded-full filter blur-3xl animate-pulse duration-5000"></div>

                    {/* 辅助光源 - 科技蓝光 */}
                    <div
                        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent rounded-full filter blur-2xl animate-pulse duration-7000 delay-1500"></div>

                    {/* 环境光 - 神秘紫色 */}
                    <div
                        className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/15 via-violet-500/8 to-transparent rounded-full filter blur-2xl animate-pulse duration-9000 delay-3000"></div>

                    {/* 边缘扫描光效 */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-y-6 opacity-30"></div>
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
                </div>
            </div>

            <div className="relative z-10">
                {currentPage === 'input' ? (
                    <div className="min-h-screen flex items-center justify-center py-12 px-4">
                        <BusinessIdeaInput
                            value={businessIdea}
                            onChange={setBusinessIdea}
                            onAnalyze={handleAnalyze}
                            isAnalyzing={isAnalyzing}
                        />
                    </div>
                ) : (
                    <div className="min-h-screen flex items-center justify-center py-12 px-4">
                        <WorldClassScenarioCards
                            suggestions={aiSuggestions}
                            selectedSuggestion={selectedSuggestion}
                            onSelect={handleSelectSuggestion}
                            onConfirm={handleGenerateReport}
                            onRetry={handleRetry}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}