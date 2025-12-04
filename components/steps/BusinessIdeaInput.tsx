'use client';

import React, { useState } from 'react';
import { BusinessIdea } from '@/types';

interface BusinessIdeaInputProps {
    value: BusinessIdea;
    onChange: (idea: BusinessIdea) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function BusinessIdeaInput({ value, onChange, onAnalyze, isAnalyzing }: BusinessIdeaInputProps) {
    // 获取字段显示值（隐藏not_sure）
    const getDisplayValue = (field: keyof BusinessIdea) => {
        const fieldValue = value[field];
        return fieldValue && fieldValue !== 'not_sure' ? fieldValue : '';
    };

    // 获取字段状态
    const getFieldState = (field: keyof BusinessIdea) => {
        const fieldValue = value[field];
        if (fieldValue && fieldValue !== 'not_sure') return 'filled';
        if (fieldValue === 'not_sure') return 'not-sure';
        return 'empty';
    };

    // 更新单个字段
    const updateField = (field: keyof BusinessIdea, fieldValue: string) => {
        onChange({
            ...value,
            [field]: fieldValue
        });
    };

    // 处理"没想好"按钮点击 - 三态切换
    const toggleNotSure = (field: keyof BusinessIdea) => {
        const currentValue = value[field];

        if (currentValue === 'not_sure') {
            // 从"没想好"切换到空白
            onChange({
                ...value,
                [field]: ''
            });
        } else if (!currentValue) {
            // 从空白切换到"没想好"
            onChange({
                ...value,
                [field]: 'not_sure'
            });
        } else {
            // 从有内容切换到空白
            onChange({
                ...value,
                [field]: ''
            });
        }
    };

    // 检查核心需求是否已填写
    const canAnalyze = value.coreNeed.trim().length > 0;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* 标题区域 */}
            <div className="text-center mb-12">
                <div className="relative inline-block mb-6">
                    {/* 外层光环 */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-3xl blur-2xl animate-pulse duration-3000"></div>

                    {/* 中层光环 */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-2xl blur-xl animate-pulse duration-2000 delay-500"></div>

                    {/* 主图标容器 */}
                    {/*<div*/}
                    {/*    className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden">*/}
                    {/*    /!* 内部光效 *!/*/}
                    {/*    <div*/}
                    {/*        className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent"></div>*/}
                    {/*    <div*/}
                    {/*        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-100/10"></div>*/}

                    {/*    <span className="relative text-3xl font-black text-white z-10">💡</span>*/}
                    {/*</div>*/}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    <span
                        className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                        描述你的想法
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                    简单描述你的想法，我帮你完善细节
                    <br/>
                    <span className="text-blue-200/90 text-sm block mt-2">
                        只需要描述"满足什么需求"即可开始
                    </span>
                </p>
            </div>

            {/* 填空题输入区域 */}
            <div
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/60 relative overflow-hidden">
                {/* 顶部装饰线 */}
                <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                {/* 填空题模板 */}
                <div className="text-center mb-8">
                    <div className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-6">
                        {/* 目标用户 */}
                        <span
                            className={`inline-block min-w-[120px] px-4 py-2 mx-2 rounded-xl transition-all duration-300 ${
                                getFieldState('targetUsers') === 'filled'
                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                    : getFieldState('targetUsers') === 'not-sure'
                                    ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
                                    : 'bg-gray-50 text-gray-500 border-2 border-dashed border-gray-300'
                            }`}>
                            {getDisplayValue('targetUsers') || (
                                <span className="cursor-pointer hover:text-gray-700" onClick={() => document.getElementById('targetUsers')?.focus()}>
                                    {getFieldState('targetUsers') === 'not-sure' ? '?' : '目标用户'}
                                </span>
                            )}
                        </span>

                        <span className="text-gray-600 mx-2">在</span>

                        {/* 使用场景 */}
                        <span
                            className={`inline-block min-w-[120px] px-4 py-2 mx-2 rounded-xl transition-all duration-300 ${
                                getFieldState('scenario') === 'filled'
                                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                                    : getFieldState('scenario') === 'not-sure'
                                    ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
                                    : 'bg-gray-50 text-gray-500 border-2 border-dashed border-gray-300'
                            }`}>
                            {getDisplayValue('scenario') || (
                                <span className="cursor-pointer hover:text-gray-700" onClick={() => document.getElementById('scenario')?.focus()}>
                                    {getFieldState('scenario') === 'not-sure' ? '?' : '使用场景'}
                                </span>
                            )}
                        </span>

                        <span className="text-gray-600 mx-2">下，愿意花</span>

                        {/* 价格范围 */}
                        <span
                            className={`inline-block min-w-[80px] px-4 py-2 mx-2 rounded-xl transition-all duration-300 ${
                                getFieldState('price') === 'filled'
                                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                    : getFieldState('price') === 'not-sure'
                                    ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
                                    : 'bg-gray-50 text-gray-500 border-2 border-dashed border-gray-300'
                            }`}>
                            {getDisplayValue('price') || (
                                <span className="cursor-pointer hover:text-gray-700" onClick={() => document.getElementById('price')?.focus()}>
                                    {getFieldState('price') === 'not-sure' ? '?' : '价格'}
                                </span>
                            )}
                        </span>

                        <span className="text-gray-600 mx-2">来满足</span>

                        {/* 核心需求 */}
                        <span
                            className={`inline-block min-w-[120px] px-4 py-2 mx-2 rounded-xl transition-all duration-300 ${
                                getFieldState('coreNeed') === 'filled'
                                    ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                                    : 'bg-gray-50 text-gray-500 border-2 border-dashed border-gray-300'
                            }`}>
                            {getDisplayValue('coreNeed') || (
                                <span className="cursor-pointer hover:text-gray-700" onClick={() => document.getElementById('coreNeed')?.focus()}>
                                    核心需求
                                </span>
                            )}
                        </span>

                        <span className="text-gray-600 mx-2">的需求</span>
                    </div>
                </div>

                {/* 输入表单 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* 目标用户 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            目标用户 <span className="text-gray-400">(可选)</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="targetUsers"
                                type="text"
                                value={getDisplayValue('targetUsers')}
                                onChange={(e) => updateField('targetUsers', e.target.value)}
                                placeholder="比如：大学生、上班族、妈妈..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            />
                            <button
                                onClick={() => toggleNotSure('targetUsers')}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                                    getFieldState('targetUsers') === 'not-sure'
                                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                {getFieldState('targetUsers') === 'not-sure'}
                                还没想好
                            </button>
                        </div>
                    </div>

                    {/* 使用场景 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            使用场景 <span className="text-gray-400">(可选)</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="scenario"
                                type="text"
                                value={getDisplayValue('scenario')}
                                onChange={(e) => updateField('scenario', e.target.value)}
                                placeholder="比如：加班时、旅行中、运动后..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                            />
                            <button
                                onClick={() => toggleNotSure('scenario')}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                                    getFieldState('scenario') === 'not-sure'
                                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                {getFieldState('scenario') === 'not-sure'}
                                还没想好
                            </button>
                        </div>
                    </div>

                    {/* 价格范围 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            价格范围 <span className="text-gray-400">(可选)</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="price"
                                type="text"
                                value={getDisplayValue('price')}
                                onChange={(e) => updateField('price', e.target.value)}
                                placeholder="比如：10元、50-100元、免费..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
                            />
                            <button
                                onClick={() => toggleNotSure('price')}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                                    getFieldState('price') === 'not-sure'
                                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                {getFieldState('price') === 'not-sure'}
                                还没想好
                            </button>
                        </div>
                    </div>

                    {/* 核心需求 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            核心需求 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="coreNeed"
                            type="text"
                            value={value.coreNeed}
                            onChange={(e) => updateField('coreNeed', e.target.value)}
                            placeholder="比如：吃宵夜、找停车位、学英语..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            这是你想法的核心，其他都可以让AI帮你完善
                        </p>
                    </div>
                </div>

                {/* 分析按钮 */}
                <div className="text-center">
                    <button
                        onClick={onAnalyze}
                        disabled={!canAnalyze || isAnalyzing}
                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                            canAnalyze && !isAnalyzing
                                ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-800 shadow-lg hover:shadow-xl text-white border-transparent'
                                : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>AI正在分析...</span>
                            </>
                        ) : (
                            <>
                                <span>分析我的想法</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}