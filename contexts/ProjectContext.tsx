'use client';  // 声明此组件为客户端组件，需要浏览器环境

// ============================================================================
// React Context 状态管理 - 类似于Android中的ViewModel + Repository模式
// ============================================================================

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjectData, CoreQuestions, BusinessModelCanvas, UserProgress, ProductInfo } from '@/types';

// ============================================================================
// 类型定义区域
// ============================================================================

/**
 * 项目全局状态接口
 * 定义整个应用中需要共享的状态数据
 * 类似于Android中的UI State数据类
 */
interface ProjectState {
  projectData: ProjectData | null;    // 当前项目数据（如果存在）
  currentStep: string;                // 当前用户所在的流程步骤
  isGenerating: boolean;              // 是否正在生成AI内容
  userProgress: UserProgress;         // 用户进度跟踪数据
}

// ============================================================================
// Action（动作）类型定义
// 类似于Android中ViewModel的Action或Intent
// ============================================================================

/**
 * 状态更新动作的联合类型
 * 定义所有可能的状态更新操作
 */
type ProjectAction =
  | { type: 'INITIALIZE_PROJECT'; payload: ProjectData }    // 初始化项目
  | { type: 'UPDATE_QUESTIONS'; payload: CoreQuestions }   // 更新问题回答
  | { type: 'UPDATE_CANVAS'; payload: BusinessModelCanvas } // 更新商业模式画布
  | { type: 'UPDATE_PRODUCT_INFO'; payload: ProductInfo }  // 更新产品构思信息
  | { type: 'SET_STEP'; payload: string }                  // 设置当前步骤
  | { type: 'SET_GENERATING'; payload: boolean }           // 设置生成状态
  | { type: 'UPDATE_PROGRESS'; payload: UserProgress }     // 更新用户进度
  | { type: 'SAVE_PROJECT' }                               // 保存项目到本地
  | { type: 'LOAD_PROJECT'; payload: string }              // 加载项目
  | { type: 'RESET_PROJECT' };                             // 重置项目

// ============================================================================
// 初始状态定义
// ============================================================================

/**
 * 应用初始状态
 * 类似于Android中ViewModel的初始状态
 */
const initialState: ProjectState = {
  projectData: null,                      // 初始没有项目数据
  currentStep: 'splash',                  // 初始显示启动页
  isGenerating: false,                    // 初始未在生成内容
  userProgress: {                         // 初始用户进度
    currentStep: 'splash',                // 当前在启动页
    completedSteps: [],                   // 没有完成的步骤
  }
};

// ============================================================================
// Reducer（状态处理器）
// 类似于Android中处理业务逻辑的函数
// ============================================================================

/**
 * 项目状态处理器
 * 根据不同的动作类型来更新状态
 * @param state 当前状态
 * @param action 触发的动作
 * @returns 新的状态
 */
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    // 初始化项目：设置项目数据，跳转到问题页面，更新进度
    case 'INITIALIZE_PROJECT':
      return {
        ...state,                                     // 保留其他状态
        projectData: action.payload,                  // 设置项目数据
        currentStep: 'questions',                     // 跳转到问题页面
        userProgress: {                               // 更新进度
          currentStep: 'questions',
          completedSteps: ['splash', 'onboarding', 'industry'], // 标记前面的步骤为已完成
          projectId: action.payload.id               // 关联项目ID
        }
      };

    // 更新问题回答：保持其他数据不变，只更新questions字段
    case 'UPDATE_QUESTIONS':
      return {
        ...state,
        projectData: state.projectData                    // 如果项目存在
          ? { ...state.projectData, questions: action.payload } // 更新问题数据
          : null                                          // 如果项目不存在则保持null
      };

    // 更新商业模式画布：保持其他数据不变，只更新canvas字段
    case 'UPDATE_CANVAS':
      return {
        ...state,
        projectData: state.projectData                    // 如果项目存在
          ? { ...state.projectData, canvas: action.payload } // 更新画布数据
          : null                                          // 如果项目不存在则保持null
      };

    // 更新产品构思信息：保持其他数据不变，只更新productInfo字段
    case 'UPDATE_PRODUCT_INFO':
      return {
        ...state,
        projectData: state.projectData                    // 如果项目存在
          ? { ...state.projectData, productInfo: action.payload } // 更新产品构思信息
          : null                                          // 如果项目不存在则保持null
      };

    // 设置当前步骤：更新当前步骤，并自动将步骤添加到已完成列表
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,                     // 设置当前步骤
        userProgress: {
          ...state.userProgress,
          currentStep: action.payload,                   // 更新进度中的当前步骤
          // 如果步骤已经在完成列表中，则不重复添加；否则添加到完成列表
          completedSteps: state.userProgress.completedSteps.includes(action.payload)
            ? state.userProgress.completedSteps
            : [...state.userProgress.completedSteps, action.payload]
        }
      };

    // 设置生成状态：用于显示加载动画
    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload                     // 设置是否正在生成内容
      };

    // 更新用户进度：完全替换进度数据
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: action.payload                     // 设置新的进度数据
      };

    // 保存项目：将数据持久化到localStorage（类似于Android的SharedPreferences）
    case 'SAVE_PROJECT':
      if (state.projectData) {
        localStorage.setItem('currentProject', JSON.stringify(state.projectData));   // 保存项目数据
        localStorage.setItem('userProgress', JSON.stringify(state.userProgress));   // 保存进度数据
      }
      return state;                                      // 状态不变，只是保存数据

    // 加载项目：从localStorage读取项目数据
    case 'LOAD_PROJECT':
      const savedProject = localStorage.getItem(action.payload);  // 获取保存的项目
      if (savedProject) {
        const projectData = JSON.parse(savedProject);             // 解析JSON数据
        return {
          ...state,
          projectData,                                           // 恢复项目数据
          currentStep: 'canvas',                                 // 跳转到画布页面
          userProgress: {                                       // 恢复进度
            currentStep: 'canvas',
            completedSteps: ['splash', 'onboarding', 'industry', 'questions'],
            projectId: projectData.id
          }
        };
      }
      return state;                                      // 没有保存的项目，返回原状态

    // 重置项目：清除所有数据，回到初始状态
    case 'RESET_PROJECT':
      localStorage.removeItem('currentProject');        // 清除保存的项目
      localStorage.removeItem('userProgress');          // 清除保存的进度
      return initialState;                               // 返回初始状态

    // 默认情况：未知动作，返回原状态
    default:
      return state;
  }
}

// ============================================================================
// React Context 创建
// ============================================================================

/**
 * 项目Context对象
 * 用于在组件树中传递状态和dispatch函数
 * 类似于Android中通过依赖注入提供ViewModel
 */
const ProjectContext = createContext<{
  state: ProjectState;                                  // 当前状态
  dispatch: React.Dispatch<ProjectAction>;             // 状态更新函数
} | null>(null);                                       // Context初始值为null

// ============================================================================
// Provider组件
// 类似于Android中的Activity/Fragment提供ViewModel
// ============================================================================

/**
 * 项目状态提供者组件
 * 包装子组件，提供状态管理功能
 * @param children 子组件
 */
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  // 使用useReducer hook管理复杂状态
  // 类似于Android中使用ViewModel + StateFlow
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // ============================================================================
  // 初始化数据恢复
  // 类似于Android中的应用启动时恢复数据
  // ============================================================================

  useEffect(() => {
    // 从localStorage读取保存的数据
    const savedProject = localStorage.getItem('currentProject');     // 保存的项目数据
    const savedProgress = localStorage.getItem('userProgress');      // 保存的进度数据

    // 恢复项目数据
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);               // 解析JSON
        dispatch({ type: 'INITIALIZE_PROJECT', payload: projectData }); // 初始化项目
      } catch (error) {
        console.error('Failed to load saved project:', error);       // 错误处理
      }
    }

    // 恢复用户进度
    if (savedProgress) {
      try {
        const userProgress = JSON.parse(savedProgress);             // 解析JSON
        dispatch({ type: 'UPDATE_PROGRESS', payload: userProgress }); // 更新进度
      } catch (error) {
        console.error('Failed to load saved progress:', error);      // 错误处理
      }
    }
  }, []);                                                         // 空依赖数组，只在组件挂载时执行一次

  // ============================================================================
  // 返回Context Provider
  // ============================================================================

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}                                                 {/* 渲染子组件 */}
    </ProjectContext.Provider>
  );
}

// ============================================================================
// 自定义Hook
// 类似于Android中获取ViewModel实例的工具函数
// ============================================================================

/**
 * 使用项目状态的Hook
 * 方便组件获取Context数据
 * @returns 状态和dispatch函数
 */
export function useProject() {
  const context = useContext(ProjectContext);                     // 获取Context

  // 确保Hook在Provider内部使用
  // 类似于Android中检查ViewModel是否为null
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;                                                // 返回状态和dispatch
}

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 创建新项目的工厂函数
 * @param name 项目名称
 * @param type 项目类型
 * @param industry 所属行业
 * @returns 新的项目数据
 */
export function createProject(name: string, type: string, industry: string): ProjectData {
  return {
    id: Date.now().toString(),                                    // 使用时间戳作为唯一ID
    name,                                                         // 项目名称
    type: type as 'mini-program' | 'app' | 'cross-platform',     // 类型断言
    industry,                                                     // 所属行业
    createdAt: new Date(),                                        // 创建时间（当前时间）
    updatedAt: new Date(),                                        // 更新时间（当前时间）
    status: 'draft',                                              // 初始状态为草稿

    // 初始化空的问答数据
    questions: {
      productDescription: '',                                     // 产品描述
      targetUsers: [],                                            // 目标用户列表
      painPoints: [],                                             // 用户痛点
      mvpFeatures: [],                                            // MVP功能
      revenueModel: []                                            // 盈利模式
    },

    // 初始化空的商业模式画布
    canvas: {
      valueProposition: [],                                       // 价值主张
      customerSegments: [],                                       // 客户细分
      channels: [],                                               // 渠道通路
      keyFeatures: [],                                            // 核心功能
      costStructure: [],                                          // 成本结构
      revenueStreams: []                                          // 收入来源
    }
  };
}