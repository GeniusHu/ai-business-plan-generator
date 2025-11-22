'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjectData, CoreQuestions, BusinessModelCanvas, UserProgress } from '@/types';

// 项目状态类型
interface ProjectState {
  projectData: ProjectData | null;
  currentStep: string;
  isGenerating: boolean;
  userProgress: UserProgress;
}

// 动作类型
type ProjectAction =
  | { type: 'INITIALIZE_PROJECT'; payload: ProjectData }
  | { type: 'UPDATE_QUESTIONS'; payload: CoreQuestions }
  | { type: 'UPDATE_CANVAS'; payload: BusinessModelCanvas }
  | { type: 'SET_STEP'; payload: string }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'UPDATE_PROGRESS'; payload: UserProgress }
  | { type: 'SAVE_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: string }
  | { type: 'RESET_PROJECT' };

// 初始状态
const initialState: ProjectState = {
  projectData: null,
  currentStep: 'splash',
  isGenerating: false,
  userProgress: {
    currentStep: 'splash',
    completedSteps: [],
  }
};

// 状态管理器
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'INITIALIZE_PROJECT':
      return {
        ...state,
        projectData: action.payload,
        currentStep: 'questions',
        userProgress: {
          currentStep: 'questions',
          completedSteps: ['splash', 'onboarding', 'project-type', 'industry'],
          projectId: action.payload.id
        }
      };

    case 'UPDATE_QUESTIONS':
      return {
        ...state,
        projectData: state.projectData
          ? { ...state.projectData, questions: action.payload }
          : null
      };

    case 'UPDATE_CANVAS':
      return {
        ...state,
        projectData: state.projectData
          ? { ...state.projectData, canvas: action.payload }
          : null
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        userProgress: {
          ...state.userProgress,
          currentStep: action.payload,
          completedSteps: state.userProgress.completedSteps.includes(action.payload)
            ? state.userProgress.completedSteps
            : [...state.userProgress.completedSteps, action.payload]
        }
      };

    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: action.payload
      };

    case 'SAVE_PROJECT':
      if (state.projectData) {
        localStorage.setItem('currentProject', JSON.stringify(state.projectData));
        localStorage.setItem('userProgress', JSON.stringify(state.userProgress));
      }
      return state;

    case 'LOAD_PROJECT':
      const savedProject = localStorage.getItem(action.payload);
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        return {
          ...state,
          projectData,
          currentStep: 'canvas',
          userProgress: {
            currentStep: 'canvas',
            completedSteps: ['splash', 'onboarding', 'project-type', 'industry', 'questions'],
            projectId: projectData.id
          }
        };
      }
      return state;

    case 'RESET_PROJECT':
      localStorage.removeItem('currentProject');
      localStorage.removeItem('userProgress');
      return initialState;

    default:
      return state;
  }
}

// Context
const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
} | null>(null);

// Provider组件
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // 初始化时恢复数据
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    const savedProgress = localStorage.getItem('userProgress');

    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);
        dispatch({ type: 'INITIALIZE_PROJECT', payload: projectData });
      } catch (error) {
        console.error('Failed to load saved project:', error);
      }
    }

    if (savedProgress) {
      try {
        const userProgress = JSON.parse(savedProgress);
        dispatch({ type: 'UPDATE_PROGRESS', payload: userProgress });
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

// Hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

// 辅助函数
export function createProject(name: string, type: string, industry: string): ProjectData {
  return {
    id: Date.now().toString(),
    name,
    type: type as 'mini-program' | 'app' | 'cross-platform',
    industry,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    questions: {
      productDescription: '',
      targetUsers: [],
      painPoints: [],
      mvpFeatures: [],
      revenueModel: []
    },
    canvas: {
      valueProposition: [],
      customerSegments: [],
      channels: [],
      keyFeatures: [],
      costStructure: [],
      revenueStreams: []
    }
  };
}