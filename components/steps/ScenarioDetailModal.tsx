'use client';

import React from 'react';
import { AISuggestion } from '@/types';

interface ScenarioDetailModalProps {
    suggestion: AISuggestion | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ScenarioDetailModal({ suggestion, isOpen, onClose }: ScenarioDetailModalProps) {
    if (!isOpen || !suggestion) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* 弹窗内容 */}
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-200">
                {/* 顶部装饰条 */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700"></div>

                {/* 弹窗头部 */}
                <div className="p-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                {suggestion.title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                                    置信度 {suggestion.confidence}%
                                </span>
                                <span className="text-sm text-gray-500">AI商业分析</span>
                            </div>
                        </div>

                        {/* 关闭按钮 */}
                        <button
                            onClick={onClose}
                            className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 弹窗内容区 - 可滚动 */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* 完整描述 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            项目概述
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-base">
                            {suggestion.description}
                        </p>
                    </div>

                    {/* 商业评估指标 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                            商业评估指标
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${getScoreColor(suggestion.marketPotential || 5)}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">市场潜力</span>
                                    <span className="text-lg font-bold">{suggestion.marketPotential || 5}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(suggestion.marketPotential || 5) * 10}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border ${getScoreColor(suggestion.competitionLevel || 5)}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">竞争程度</span>
                                    <span className="text-lg font-bold">{suggestion.competitionLevel || 5}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(suggestion.competitionLevel || 5) * 10}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border ${getScoreColor(10 - (suggestion.executionDifficulty || 5))}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">执行难度</span>
                                    <span className="text-lg font-bold">{suggestion.executionDifficulty || 5}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(suggestion.executionDifficulty || 5) * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 目标用户 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            目标用户
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-green-800 font-medium">{suggestion.targetUsers}</p>
                        </div>
                    </div>

                    {/* 使用场景 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            使用场景
                        </h3>
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <p className="text-purple-800">{suggestion.scenario}</p>
                        </div>
                    </div>

                    {/* 定价策略 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            定价策略
                        </h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-yellow-800 font-medium">{suggestion.price}</p>
                        </div>
                    </div>

                    {/* 核心竞争优势 */}
                    {suggestion.keyAdvantages && suggestion.keyAdvantages.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                                核心竞争优势
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {suggestion.keyAdvantages.map((advantage, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="text-emerald-800 text-sm">{advantage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 潜在风险 */}
                    {suggestion.potentialRisks && suggestion.potentialRisks.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                潜在风险
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {suggestion.potentialRisks.map((risk, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="text-red-800 text-sm">{risk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 市场规模估算 */}
                    {suggestion.estimatedMarketSize && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                市场规模估算
                            </h3>
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                <p className="text-indigo-800">{suggestion.estimatedMarketSize}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 弹窗底部 */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 text-white font-semibold rounded-xl hover:from-emerald-600 hover:via-blue-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105"
                        >
                            关闭详情
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}