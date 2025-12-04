'use client';

import React, { useState } from 'react';
import { AISuggestion } from '@/types';
import { ScenarioDetailModal } from './ScenarioDetailModal';

interface WorldClassScenarioCardsProps {
    suggestions: AISuggestion[];
    selectedSuggestion: number | undefined;
    onSelect: (index: number) => void;
    onConfirm: () => void;
    onRetry: () => void;
}

export function WorldClassScenarioCards({
    suggestions,
    selectedSuggestion,
    onSelect,
    onConfirm,
    onRetry
}: WorldClassScenarioCardsProps) {
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedDetailSuggestion, setSelectedDetailSuggestion] = useState<AISuggestion | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const openDetailModal = (suggestion: AISuggestion) => {
        setSelectedDetailSuggestion(suggestion);
        setDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedDetailSuggestion(null);
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (score >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 85) return 'bg-emerald-500';
        if (confidence >= 70) return 'bg-blue-500';
        if (confidence >= 55) return 'bg-amber-500';
        return 'bg-gray-400';
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* 世界级分析结果标题 */}
            <div className="text-center mb-12">
                <div className="relative inline-block mb-6">
                    {/* 多层光环效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-purple-600/30 rounded-3xl blur-3xl animate-pulse duration-4000"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-purple-600/40 rounded-2xl blur-xl animate-pulse duration-3000 delay-500"></div>

                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-100/10 rounded-3xl"></div>
                        <svg className="relative w-10 h-10 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                    <span className="block mb-2">商业机会</span>
                    <span className="bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                        智能分析报告
                    </span>
                </h1>

                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    基于豆包AI的深度商业分析
                    <br />
                    <span className="text-blue-200/90 text-lg block mt-3">
                        为您生成{Math.max(3, suggestions.length)}个具有潜力的商业场景，每个都经过专业评估
                    </span>
                </p>
            </div>

            {/* 场景卡片网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={suggestion.id}
                        className={`relative group cursor-pointer transition-all duration-500 transform hover:-translate-y-3 ${
                            selectedSuggestion === index ? 'scale-105' : ''
                        }`}
                        onClick={() => onSelect(index)}
                    >
                        {/* 卡片主体 */}
                        <div className={`relative h-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-2 transition-all duration-500 ${
                            selectedSuggestion === index
                                ? 'border-emerald-400 shadow-emerald-200/50'
                                : 'border-white/60 hover:border-blue-300/80 hover:shadow-blue-200/50'
                        }`}>
                            {/* 顶部状态栏 */}
                            <div className={`h-2 bg-gradient-to-r ${
                                selectedSuggestion === index
                                    ? 'from-emerald-500 via-blue-500 to-purple-600'
                                    : 'from-gray-400 via-gray-500 to-gray-600'
                            }`}></div>

                            {/* 选中指示器 */}
                            {selectedSuggestion === index && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* 卡片内容 */}
                            <div className="p-7">
                                {/* 标题和置信度 */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 mr-3">
                                        {suggestion.title}
                                    </h3>
                                    <div className="flex flex-col items-center min-w-[60px]">
                                        <div className={`w-3 h-3 rounded-full ${getConfidenceColor(suggestion.confidence)} animate-pulse`}></div>
                                        <span className="text-xs text-gray-500 mt-1">{suggestion.confidence}%</span>
                                    </div>
                                </div>

                                {/* 简短描述 */}
                                <div className="mb-6">
                                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                        {suggestion.description.split('\n\n')[0]}
                                    </p>
                                </div>

                                {/* 关键指标 - 世界级设计 */}
                                {suggestion.marketPotential && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-600 mb-3">商业评估指标</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">市场潜力</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getScoreColor(suggestion.marketPotential).split(' ')[2]}`}
                                                            style={{ width: `${suggestion.marketPotential * 10}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(suggestion.marketPotential)}`}>
                                                        {suggestion.marketPotential}/10
                                                    </span>
                                                </div>
                                            </div>

                                            {suggestion.competitionLevel && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">竞争程度</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${getScoreColor(10 - suggestion.competitionLevel).split(' ')[2]}`}
                                                                style={{ width: `${suggestion.competitionLevel * 10}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(10 - suggestion.competitionLevel)}`}>
                                                            {suggestion.competitionLevel}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {suggestion.executionDifficulty && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">执行难度</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${getScoreColor(10 - suggestion.executionDifficulty).split(' ')[2]}`}
                                                                style={{ width: `${suggestion.executionDifficulty * 10}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(10 - suggestion.executionDifficulty)}`}>
                                                            {suggestion.executionDifficulty}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 核心信息标签 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-xs text-gray-600 font-medium">目标用户:</span>
                                        <span className="text-xs text-gray-800 bg-blue-50 px-2 py-1 rounded-full">
                                            {suggestion.targetUsers}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-xs text-gray-600 font-medium">使用场景:</span>
                                        <span className="text-xs text-gray-800 bg-purple-50 px-2 py-1 rounded-full max-w-[200px] truncate">
                                            {suggestion.scenario}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-gray-600 font-medium">定价策略:</span>
                                        <span className="text-xs text-gray-800 bg-green-50 px-2 py-1 rounded-full">
                                            {suggestion.price}
                                        </span>
                                    </div>
                                </div>

                                {/* 查看详情按钮 */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDetailModal(suggestion);
                                    }}
                                    className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 py-2 rounded-xl border border-blue-200"
                                >
                                    <span>查看详情</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* 悬停光效 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>

            {/* 操作按钮区域 - 世界级设计 */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <button
                    onClick={onRetry}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                    <div className="relative flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">重新分析</span>
                    </div>

                    {/* 按钮光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                    onClick={onConfirm}
                    disabled={selectedSuggestion === undefined}
                    className={`group relative flex items-center gap-4 px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                        selectedSuggestion !== undefined
                            ? 'bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-800 shadow-xl hover:shadow-2xl text-white border-transparent'
                            : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                    }`}
                >
                    {selectedSuggestion !== undefined && (
                        <>
                            <div className="relative flex items-center gap-3">
                                <span>生成深度分析报告</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>

                            {/* 成功指示器动画 */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>

                            {/* 按钮光效 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                    )}
                    {selectedSuggestion === undefined && (
                        <span>请选择一个商业场景</span>
                    )}
                </button>
            </div>

            {/* 详情弹窗 */}
            <ScenarioDetailModal
                suggestion={selectedDetailSuggestion}
                isOpen={detailModalOpen}
                onClose={closeDetailModal}
            />
        </div>
    );
}