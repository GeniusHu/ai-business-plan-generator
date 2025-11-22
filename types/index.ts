// 项目基础类型定义
export interface ProjectInfo {
  id: string;
  name: string;
  type: 'mini-program' | 'app' | 'cross-platform';
  industry: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'completed';
}

// 核心问题数据结构
export interface CoreQuestions {
  // Q1: 产品主要做什么
  productDescription: string;

  // Q2: 目标用户
  targetUsers: string[];
  customTargetUser?: string;

  // Q3: 核心痛点
  painPoints: string[];
  customPainPoint?: string;

  // Q4: MVP功能
  mvpFeatures: string[];

  // Q5: 盈利模式
  revenueModel: string[];
}

// 商业模式画布数据
export interface BusinessModelCanvas {
  // 核心价值
  valueProposition: string[];

  // 客户细分
  customerSegments: string[];

  // 渠道通路
  channels: string[];

  // 核心功能
  keyFeatures: string[];

  // 成本结构
  costStructure: string[];

  // 收入来源
  revenueStreams: string[];
}

// 完整项目数据
export interface ProjectData extends ProjectInfo {
  questions: CoreQuestions;
  canvas: BusinessModelCanvas;
  generatedContent?: {
    marketAnalysis: string;
    userAnalysis: string;
    competitorAnalysis: string;
    riskAssessment: string;
    versionRoadmap: string[];
  };
}

// 行业模板配置
export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  targetUsers: string[];
  commonPainPoints: string[];
  typicalFeatures: string[];
  revenueModels: string[];
}

// 用户进度管理
export interface UserProgress {
  currentStep: string;
  completedSteps: string[];
  projectId?: string;
}

// 导出格式
export interface ExportOptions {
  format: 'html' | 'pdf' | 'word';
  includeBranding: boolean;
  sections: string[];
}