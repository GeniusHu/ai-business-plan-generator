'use client';

import React from 'react';
import { AISuggestion } from '@/types';

interface AISuggestionCardsProps {
    suggestions: AISuggestion[];
    selectedSuggestion: number | undefined;
    onSelect: (index: number) => void;
    onConfirm: () => void;
    onRetry: () => void;
}

export function AISuggestionCards({
    suggestions,
    selectedSuggestion,
    onSelect,
    onConfirm,
    onRetry
}: AISuggestionCardsProps) {
    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* 分析结果标题 */}
            <div className="text-center mb-10">
                <div className="relative inline-block mb-4">
                    {/* AI图标光环 */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/40 via-blue-400/40 to-purple-400/40 rounded-full blur-2xl animate-pulse duration-3000"></div>

                    <div
                        className="relative w-16 h-16 bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-xl">
                        <span className="text-2xl">🤖</span>
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                    <span
                        className="bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                        AI分析结果
                    </span>
                </h2>

                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                    根据你的描述，我理解你是想：
                    <br/>
                    <span className="text-blue-200/90 text-sm">
                        选择最符合你想法的描述，或者让我重新分析
                    </span>
                </p>
            </div>

            {/* 建议卡片网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={suggestion.id}
                        onClick={() => onSelect(index)}
                        className={`relative p-6 rounded-2xl shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                            selectedSuggestion === index
                                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400 shadow-blue-200'
                                : 'bg-white/90 backdrop-blur-md border-white/60 hover:border-blue-300/60 hover:shadow-2xl'
                        }`}
                    >
                        {/* 选中指示器 */}
                        {selectedSuggestion === index && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        )}

                        {/* 置信度标签 */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-medium">
                                置信度 {suggestion.confidence}%
                            </span>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${
                                            i < Math.floor(suggestion.confidence / 20)
                                                ? 'bg-blue-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 建议标题 */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {suggestion.title}
                        </h3>

                        {/* 完整描述 */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {suggestion.description}
                        </p>

                        {/* 关键信息标签 */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">目标用户：</span>
                                    {suggestion.targetUsers}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">使用场景：</span>
                                    {suggestion.scenario}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">价格范围：</span>
                                    {suggestion.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <button
                    onClick={onRetry}
                    className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span className="font-medium text-gray-700">重新分析</span>
                </button>

                <button
                    onClick={onConfirm}
                    disabled={selectedSuggestion === undefined}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedSuggestion !== undefined
                            ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-800 shadow-lg hover:shadow-xl text-white border-transparent'
                            : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                    }`}
                >
                    <span>确认并开始聊天</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}