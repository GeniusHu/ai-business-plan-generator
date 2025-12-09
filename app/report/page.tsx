'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { BusinessScenario } from '@/types';
import { PreliminaryReport } from '@/services/aiService';

interface ReportData {
    scenario: BusinessScenario;
    report: PreliminaryReport;
    businessIdea: any;
    generatedAt: string;
}

export default function ReportPage() {
    const router = useRouter();
    const { dispatch } = useProject();

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        console.log('📄 /report 页面加载，开始读取localStorage数据');
        const saved = localStorage.getItem('preliminaryReport');
        console.log('💾 localStorage中的preliminaryReport数据:', saved);

        if (saved) {
            try {
                console.log('🔄 解析报告数据...');
                const data = JSON.parse(saved);
                console.log('✅ 报告数据解析成功:', data);
                setReportData(data);
                console.log('✅ 报告数据已加载完成');
            } catch (error) {
                console.error('💥 解析报告数据失败:', error);
                console.error('❌ 错误类型:', error.constructor.name);
                console.error('❌ 错误消息:', error.message);
                console.log('🔄 重定向到 /industry 页面');
                router.push('/industry');
            }
        } else {
            console.log('❌ localStorage中没有找到preliminaryReport数据');
            console.log('🔄 重定向到 /industry 页面');
            router.push('/industry');
        }
    }, [router]);

    // 暂时不清理localStorage数据，让用户可以在开发模式下正常查看报告
    // 在生产环境中，可以考虑在用户主动离开时清理

    if (!reportData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="text-center text-white">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p>加载分析报告...</p>
                </div>
            </div>
        );
    }

    const handleStartChat = () => {
        // 传递报告数据到chat页面
        localStorage.setItem('reportAnalysis', JSON.stringify({
            scenario: reportData.scenario,
            report: reportData.report
        }));

        // 跳转到chat页面进行深入讨论
        dispatch({ type: 'SET_STEP', payload: 'chat' });
        router.push('/chat');
    };

    const handleExportReport = () => {
        setIsExporting(true);
        // 这里可以实现导出功能，生成PDF或Word文档
        setTimeout(() => {
            setIsExporting(false);
            // 模拟导出完成
            alert('报告导出功能开发中...');
        }, 2000);
    };

    const { scenario, report } = reportData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            {/* 奢华级背景装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 via-purple-300/15 to-pink-300/10 rounded-full blur-3xl animate-pulse duration-8000"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-300/15 via-indigo-300/10 to-blue-300/8 rounded-full blur-3xl animate-pulse duration-10000 delay-2000"></div>
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-amber-300/10 via-yellow-300/8 to-green-300/6 rounded-full blur-2xl animate-pulse duration-12000 delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
                {/* 报告头部 */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-8 border border-white/60">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-purple-500/20 rounded-2xl blur-xl"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-black text-gray-900 mb-2">{scenario.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        商业分析报告
                                    </span>
                                    <span>•</span>
                                    <span>生成时间: {new Date(reportData.generatedAt).toLocaleString('zh-CN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">AI置信度: {scenario.confidence}%</span>
                            </div>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="text-sm text-gray-600">
                                报告编号: {scenario.id}
                            </div>
                        </div>
                    </div>

                    {/* 核心指标概览 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-emerald-900">市场潜力</h3>
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {scenario.marketPotential}
                                </div>
                            </div>
                            <p className="text-emerald-700 text-sm">该商业场景具有很高的市场潜力和发展空间</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-blue-900">竞争程度</h3>
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {scenario.competitionLevel}
                                </div>
                            </div>
                            <p className="text-blue-700 text-sm">市场竞争程度为{scenario.competitionLevel}/10分，需要差异化策略</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-purple-900">执行难度</h3>
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {scenario.executionDifficulty}
                                </div>
                            </div>
                            <p className="text-purple-700 text-sm">项目执行难度评估，需要相应的资源和经验</p>
                        </div>
                    </div>

                    {/* 核心信息摘要 */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">商业机会概述</h3>
                        <p className="text-gray-700 mb-4">{scenario.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-700">目标用户</span>
                                </div>
                                <p className="text-sm text-gray-600">{scenario.targetUsers}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-700">使用场景</span>
                                </div>
                                <p className="text-sm text-gray-600">{scenario.scenario}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-700">定价策略</span>
                                </div>
                                <p className="text-sm text-gray-600">{scenario.price}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 详细分析报告 */}
                <div className="space-y-8">
                    {/* 市场分析 */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">市场分析</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">市场规模与增长</h3>
                                <div className="bg-blue-50 rounded-xl p-6 mb-4">
                                    <p className="text-3xl font-bold text-blue-900 mb-2">{report.marketAnalysis.marketSize}</p>
                                    <p className="text-sm text-blue-700 mb-1">年增长率: <span className="font-semibold">{report.marketAnalysis.growthRate}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">目标用户画像</h3>
                                <p className="text-gray-700 mb-4">{report.marketAnalysis.targetDemographics}</p>

                                <h4 className="text-sm font-semibold text-gray-700 mb-2">核心痛点分析</h4>
                                <ul className="space-y-2">
                                    {report.marketAnalysis.painPoints.map((painPoint, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span className="text-sm text-gray-600">{painPoint}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 竞争分析 */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">竞争分析</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-purple-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-purple-900 mb-4">竞争对手类型</h3>
                                <ul className="space-y-2">
                                    {report.competitionAnalysis.competitorTypes.map((competitor, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span className="text-sm text-gray-700">{competitor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-purple-900 mb-4">差异化策略</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">{report.competitionAnalysis.differentiationStrategy}</p>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-purple-900 mb-4">核心竞争优势</h3>
                                <ul className="space-y-2">
                                    {report.competitionAnalysis.competitiveAdvantages.map((advantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span className="text-sm text-gray-700">{advantage}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 产品策略 */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2zM9 9H6m0 0h3m-3 0h3m-6 0h6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">产品策略</h2>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">独特价值主张</h3>
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                                <p className="text-emerald-900 font-medium text-center text-lg">{report.productStrategy.uniqueValueProposition}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">核心功能规划</h3>
                                <ul className="space-y-3">
                                    {report.productStrategy.coreFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4">
                                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">开发阶段规划</h3>
                                <div className="space-y-3">
                                    {report.productStrategy.developmentPhases.map((phase, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-2 bg-emerald-500" style={{ width: `${(index + 1) * 33}%` }}></div>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">{phase}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 盈利模式 */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2zm0 8c1.11 0 2.08.402 2.599 1M12 8V7m0 1l-2.599-1.599M12 8l2.599 1.599M15 3a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">盈利模式</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-green-900 mb-4">主要收入来源</h3>
                                <p className="text-green-800 font-medium text-lg">{report.revenueModel.primaryRevenue}</p>
                                <p className="text-sm text-green-700 mt-2">{report.revenueModel.pricingStrategy}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 md:col-span-2">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">多元化收入渠道</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {report.revenueModel.revenueStreams.map((stream, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-blue-200">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                            <span className="text-sm text-gray-700">{stream}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 风险评估 */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">风险评估与应对</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-red-800 mb-4 bg-red-50 rounded-lg p-3">市场风险</h3>
                                <ul className="space-y-3">
                                    {report.risks.marketRisks.map((risk, index) => (
                                        <li key={index} className="flex items-start gap-3 bg-red-50/50 rounded-lg p-4 border border-red-100">
                                            <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-red-800">{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-amber-800 mb-4 bg-amber-50 rounded-lg p-3">执行风险</h3>
                                <ul className="space-y-3">
                                    {report.risks.executionRisks.map((risk, index) => (
                                        <li key={index} className="flex items-start gap-3 bg-amber-50/50 rounded-lg p-4 border border-amber-100">
                                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-amber-800">{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-emerald-800 mb-4 bg-emerald-50 rounded-lg p-3">风险缓解策略</h3>
                                <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                                    <ul className="space-y-2">
                                        {report.risks.mitigationStrategies.map((strategy, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                                <span className="text-sm text-emerald-800">{strategy}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                    <button
                        onClick={handleExportReport}
                        disabled={isExporting}
                        className="flex items-center gap-3 px-8 py-4 bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold text-gray-700"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>导出中...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>导出完整报告</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleStartChat}
                        className="flex items-center gap-4 px-12 py-4 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-800 shadow-xl hover:shadow-2xl text-white border-transparent rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <span>开始深入讨论</span>
                        <svg className="w-5 h-5 transform hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8c0 1.574-.512 3.04-1.395 4.28L21 12z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}