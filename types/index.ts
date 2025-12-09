// ============================================================================
// 项目数据类型定义文件 - 类似于Android中的数据模型类
// ============================================================================

/**
 * 项目基础信息接口
 * 类似于Android中的Project实体类或Room数据库的Entity
 */
export interface ProjectInfo {
  id: string;                                    // 项目唯一标识符（UUID）
  name: string;                                  // 项目名称
  type: 'mini-program' | 'app' | 'cross-platform'; // 项目类型：小程序 | APP | 跨平台应用
  industry: string;                              // 所属行业（如：电商、教育、医疗等）
  createdAt: Date;                               // 项目创建时间
  updatedAt: Date;                               // 项目最后更新时间
  status: 'draft' | 'completed';                // 项目状态：草稿 | 已完成
}

/**
 * 产品构思信息结构
 * 用户在步骤式向导中填写的完整产品信息
 * 类似于Android中的产品实体数据类
 */
export interface ProductInfo {
  industry: string;                              // 用户选择的行业ID
  productDescription: string;                    // 产品描述
  usageScenario: string;                         // 使用场景
  targetUsers: string;                           // 目标用户和遇到的问题
  solution: string;                             // 解决方案
  revenueModel: string;                         // 盈利模式

  // 元数据
  currentStep: number;                           // 当前步骤 1-5
  isCompleted: boolean;                          // 是否全部完成
  createdAt: string;                             // 创建时间
  updatedAt: string;                             // 最后更新时间
}

/**
 * 对话消息结构
 * AI对话页面中的单条消息
 */
export interface ChatMessage {
  id: string;                                    // 消息唯一ID
  role: 'user' | 'assistant';                    // 角色：用户或AI助手
  content: string;                               // 消息内容
  timestamp: string;                             // 时间戳
}

/**
 * AI分析结果结构
 * AI对产品信息完整性和质量的评估
 */
export interface AIAnalysis {
  completeness: number;                          // 完整度评分 0-100
  missingAspects: string[];                      // 缺失的方面
  recommendations: string[];                     // AI建议
  isReadyToGenerate: boolean;                    // 是否可以生成商业计划
}

/**
 * 对话会话结构
 * AI对话页面的完整会话数据
 */
export interface ChatSession {
  sessionId: string;                             // 会话唯一ID
  productInfo: ProductInfo;                      // 初始产品信息
  messages: ChatMessage[];                       // 对话历史
  aiAnalysis: AIAnalysis;                        // AI分析结果
  createdAt: string;                             // 创建时间
  updatedAt: string;                             // 最后更新时间
}

/**
 * 核心问题数据结构
 * 对应用户在项目中回答的关键业务问题
 * 类似于Android中的问卷调查数据模型
 * @deprecated 被ProductInfo取代，保留用于向后兼容
 */
export interface CoreQuestions {
  // 问题1: 产品主要做什么？
  productDescription: string;                    // 产品功能描述文本

  // 问题2: 目标用户是谁？
  targetUsers: string[];                         // 预设的目标用户群体列表
  customTargetUser?: string;                     // 自定义目标用户（可选）

  // 问题3: 解决什么核心痛点？
  painPoints: string[];                          // 预设的用户痛点列表
  customPainPoint?: string;                      // 自定义痛点（可选）

  // 问题4: MVP最小可行产品包含哪些功能？
  mvpFeatures: string[];                         // 核心功能列表

  // 问题5: 计划如何盈利？
  revenueModel: string[];                        // 盈利模式列表（如：广告、订阅、电商等）
}

/**
 * 商业模式画布数据结构
 * 基于经典的Business Model Canvas框架
 * 类似于Android中的商业计划数据模型
 */
export interface BusinessModelCanvas {
  // 核心价值主张
  valueProposition: string[];                    // 产品为用户提供的核心价值

  // 客户细分
  customerSegments: string[];                    // 目标客户群体分类

  // 渠道通路
  channels: string[];                            // 产品触达用户的渠道

  // 核心功能/资源
  keyFeatures: string[];                         // 产品的核心功能和关键资源

  // 成本结构
  costStructure: string[];                       // 主要成本构成

  // 收入来源
  revenueStreams: string[];                      // 多元化收入渠道
}

/**
 * 完整项目数据结构
 * 继承ProjectInfo，包含项目的所有信息
 * 类似于Android中的完整项目数据类
 */
export interface ProjectData extends ProjectInfo {
  // 添加产品构思信息
  productInfo?: ProductInfo;                      // 产品构思信息

  questions: CoreQuestions;                      // 用户回答的核心问题
  canvas: BusinessModelCanvas;                   // 商业模式画布数据

  // AI生成的内容（可选）
  generatedContent?: {
    marketAnalysis: string;                      // 市场分析报告
    userAnalysis: string;                        // 用户分析报告
    competitorAnalysis: string;                  // 竞品分析报告
    riskAssessment: string;                      // 风险评估报告
    versionRoadmap: string[];                    // 产品版本路线图
  };
}

/**
 * 行业模板配置
 * 不同行业的预设模板，帮助用户快速开始
 * 类似于Android中的模板数据类
 */
export interface IndustryTemplate {
  id: string;                                    // 模板唯一标识
  name: string;                                  // 行业名称
  icon: string;                                  // 行业图标（emoji或图标名称）
  description: string;                           // 行业描述
  targetUsers: string[];                         // 该行业常见的目标用户群体
  commonPainPoints: string[];                    // 该行业常见的用户痛点
  typicalFeatures: string[];                     // 该行业典型的产品功能
  revenueModels: string[];                       // 该行业主流的盈利模式
}

/**
 * 用户进度管理
 * 跟踪用户在项目创建流程中的进度
 * 类似于Android中的进度跟踪类
 */
export interface UserProgress {
  currentStep: string;                           // 当前所在的步骤标识
  completedSteps: string[];                      // 已完成的步骤列表
  projectId?: string;                            // 关联的项目ID（可选）
}

export interface BusinessScenario {
  id: string;
  title: string;
  description: string;
  targetUsers: string;
  scenario: string;
  price: string;
  marketPotential: number; // 1-10分
  competitionLevel: number; // 1-10分
  executionDifficulty: number; // 1-10分
  keyAdvantages: string[];
  potentialRisks: string[];
  estimatedMarketSize: string;
  confidence: number;
}

/**
 * 商业想法填空题结构
 * 用于快速输入和解析用户的核心商业想法
 */
export interface BusinessIdea {
  targetUsers: string | 'not_sure';             // 目标用户（可选填）
  scenario: string | 'not_sure';                // 使用场景（可选填）
  price: string | 'not_sure';                   // 价格范围（可选填）
  coreNeed: string;                             // 核心需求（必填）

  // AI分析结果
  aiSuggestions?: AISuggestion[];               // AI生成的建议示例
  selectedSuggestion?: number;                  // 用户选择的建议索引
  isAnalyzed?: boolean;                         // 是否已完成AI分析
}

/**
 * AI建议示例结构
 * AI为用户商业想法生成的具体示例
 */
export interface AISuggestion {
  id: string;                                   // 建议唯一ID
  title: string;                                // 建议标题
  description: string;                          // 完整描述
  targetUsers: string;                          // 目标用户
  scenario: string;                             // 使用场景
  price: string;                                // 价格范围
  score: number;                          // AI评分 0-100

  // 世界级分析扩展字段
  marketPotential?: number;                     // 市场潜力评估 1-10
  competitionLevel?: number;                    // 竞争激烈程度 1-10
  executionDifficulty?: number;                 // 执行难度 1-10
  keyAdvantages?: string[];                     // 核心竞争优势
  potentialRisks?: string[];                     // 潜在风险
  estimatedMarketSize?: string;                 // 估算市场规模
}

/**
 * 导出选项配置
 * 定义项目导出的格式和内容
 * 类似于Android中的导出设置类
 */
export interface ExportOptions {
  format: 'html' | 'pdf' | 'word';              // 导出格式：HTML | PDF | Word文档
  includeBranding: boolean;                      // 是否包含品牌信息
  sections: string[];                            // 要导出的章节列表
}