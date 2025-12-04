'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useProject, createProject} from '@/contexts/ProjectContext';
import {BusinessIdea, AISuggestion} from '@/types';
import {BusinessIdeaInput} from '@/components/steps/BusinessIdeaInput';
import {AISuggestionCards} from '@/components/steps/AISuggestionCards';

// Mock AI分析函数 - 后续可以替换为真实的AI API
async function analyzeBusinessIdea(idea: BusinessIdea): Promise<AISuggestion[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查字段是否有有效内容
    const hasTargetUsers = idea.targetUsers && idea.targetUsers !== 'not_sure';
    const hasScenario = idea.scenario && idea.scenario !== 'not_sure';
    const hasPrice = idea.price && idea.price !== 'not_sure';

    // 基于输入信息生成不同数量的建议
    if (hasTargetUsers && hasScenario && hasPrice) {
        // 信息完整，生成1-2个精确建议
        return [
            {
                id: '1',
                title: `${idea.targetUsers}解决方案`,
                description: `${idea.targetUsers}在${idea.scenario}时，愿意花${idea.price}来满足自己${idea.coreNeed}的需求。这是一个很有针对性的商业想法。`,
                targetUsers: idea.targetUsers,
                scenario: idea.scenario,
                price: idea.price,
                confidence: 90
            }
        ];
    } else {
        // 信息不完整，生成3-5个角度的建议
        const suggestions: AISuggestion[] = [];

        // 基于核心需求生成不同角度的建议
        if (idea.coreNeed.includes('吃') || idea.coreNeed.includes('餐') || idea.coreNeed.includes('食')) {
            suggestions.push({
                id: '1',
                title: '健康餐饮服务',
                description: '为忙碌的都市白领提供健康便捷的餐饮解决方案，解决工作忙碌时的用餐需求。',
                targetUsers: '上班族、大学生',
                scenario: '工作加班、学习时',
                price: '15-40元',
                confidence: 85
            });
        }

        if (idea.coreNeed.includes('学') || idea.coreNeed.includes('教') || idea.coreNeed.includes('习')) {
            suggestions.push({
                id: '2',
                title: '在线教育平台',
                description: '为职场新人提供专业技能培训和学习资源，帮助提升职业竞争力。',
                targetUsers: '职场新人、大学生',
                scenario: '职业发展、技能提升时',
                price: '99-299元/月',
                confidence: 80
            });
        }

        suggestions.push({
            id: '3',
            title: '便民生活服务',
            description: '为社区居民提供便捷的生活服务，解决日常生活中的各种痛点问题。',
            targetUsers: '社区居民、家庭用户',
            scenario: '日常生活、紧急需求时',
            price: '10-50元',
            confidence: 75
        });

        suggestions.push({
            id: '4',
            title: '效率工具应用',
            description: '为工作效率低下的人群提供智能工具，帮助提升工作和生活效率。',
            targetUsers: '上班族、自由职业者',
            scenario: '工作、项目管理时',
            price: '免费/20-100元/月',
            confidence: 70
        });

        suggestions.push({
            id: '5',
            title: '健康管理服务',
            description: '为注重健康的人群提供个性化健康管理方案，改善生活质量。',
            targetUsers: '健康关注者、中老年人',
            scenario: '日常健康监测、调理时',
            price: '50-200元',
            confidence: 72
        });

        // 根据已有信息过滤和排序
        let filteredSuggestions = suggestions;

        if (hasTargetUsers) {
            filteredSuggestions = filteredSuggestions.filter(s =>
                s.targetUsers.includes(idea.targetUsers!)
            );
        }

        if (hasScenario) {
            filteredSuggestions = filteredSuggestions.filter(s =>
                s.scenario.includes(idea.scenario!)
            );
        }

        if (hasPrice) {
            filteredSuggestions = filteredSuggestions.filter(s =>
                s.price.includes(idea.price!) ||
                (parseInt(idea.price!) >= 10 && parseInt(idea.price!) <= 50)
            );
        }

        // 如果过滤后没有结果，返回前3个通用建议
        return filteredSuggestions.length > 0 ? filteredSuggestions.slice(0, 3) : suggestions.slice(0, 3);
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

    // 确认并跳转到chat
    const handleConfirmAndChat = () => {
        if (selectedSuggestion === undefined || !aiSuggestions[selectedSuggestion]) {
            return;
        }

        const selected = aiSuggestions[selectedSuggestion];

        // 创建项目数据
        const project = createProject(
            selected.title,
            'mini-program',
            'general' // 通用行业，因为我们取消了行业选择
        );

        // 创建产品信息（兼容现有结构）
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

        // 更新项目状态
        dispatch({type: 'INITIALIZE_PROJECT', payload: project});
        dispatch({type: 'UPDATE_PRODUCT_INFO', payload: productInfo});
        dispatch({type: 'SET_STEP', payload: 'chat'});

        // 传递商业想法信息到chat页面
        localStorage.setItem('currentBusinessIdea', JSON.stringify({
            businessIdea,
            selectedSuggestion: selected
        }));

        // 跳转到chat页面
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
                        <AISuggestionCards
                            suggestions={aiSuggestions}
                            selectedSuggestion={selectedSuggestion}
                            onSelect={handleSelectSuggestion}
                            onConfirm={handleConfirmAndChat}
                            onRetry={handleRetry}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}