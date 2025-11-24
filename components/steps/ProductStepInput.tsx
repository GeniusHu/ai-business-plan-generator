'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface ProductStepInputProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  examples: string[];
  icon: React.ReactNode;
  isLastStep?: boolean;
}

/**
 * 产品步骤输入组件
 * 每个步骤的输入界面，包含输入框和可展开的示例
 * 类似于Android中的步骤输入控件
 */
export function ProductStepInput({
  stepNumber,
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  examples,
  icon,
  isLastStep = false
}: ProductStepInputProps) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {/* 步骤标题 */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>

      {/* 示例区域 */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* 示例切换按钮 */}
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              查看示例 {showExamples ? '▲' : '▼'}
            </span>
          </div>
          {showExamples ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* 示例内容 */}
        {showExamples && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              这里有一些示例可以参考：
            </p>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div
                  key={index}
                  onClick={() => onChange(example)}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <p className="text-sm text-blue-800">{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 字符提示 */}
      <div className="mt-2 text-right">
        <span className={`text-sm ${value.length > 500 ? 'text-orange-500' : 'text-gray-400'}`}>
          {value.length} 字符
        </span>
      </div>
    </div>
  );
}