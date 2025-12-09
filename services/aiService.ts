/**
 * 世界级AI服务模块
 * 集成豆包AI，提供专业的商业分析能力
 */

export interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIAnalysisRequest {
    targetUsers?: string;
    scenario?: string;
    price?: string;
    coreNeed: string;
}

export interface AIAnalysisRejection {
    shouldAnalyze: false;
    reason: string;
    suggestion: string;
}

export type AIAnalysisResult = BusinessScenario[] | AIAnalysisRejection;

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

export interface PreliminaryReport {
    scenarioId: string;
    marketAnalysis: {
        marketSize: string;
        growthRate: string;
        targetDemographics: string;
        painPoints: string[];
    };
    competitionAnalysis: {
        competitorTypes: string[];
        differentiationStrategy: string;
        competitiveAdvantages: string[];
    };
    productStrategy: {
        coreFeatures: string[];
        uniqueValueProposition: string;
        developmentPhases: string[];
    };
    revenueModel: {
        primaryRevenue: string;
        pricingStrategy: string;
        revenueStreams: string[];
    };
    risks: {
        marketRisks: string[];
        executionRisks: string[];
        mitigationStrategies: string[];
    };
}

class AIService {
    private apiKey: string;
    private model: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.DOUBAO_API_KEY || '';
        this.model = process.env.DOUBAO_MODEL || 'doubao-1-5-pro-32k-250115';
        this.baseUrl = process.env.DOUBAO_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

        if (!this.apiKey) {
            throw new Error('豆包API密钥未配置');
        }
    }

    /**
     * 调用豆包API
     */
    private async callAI(messages: AIMessage[], temperature: number = 0.7): Promise<string> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    temperature,
                    max_tokens: 4000,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`豆包API调用失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('豆包AI调用错误:', error);
            throw new Error('AI分析服务暂时不可用，请稍后再试');
        }
    }

    /**
     * 分析商业想法并生成典型场景
     */
    async analyzeBusinessIdea(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
        const prompt = this.buildScenarioAnalysisPrompt(request);

        const messages: AIMessage[] = [
            {
                role: 'system',
                content: '你是一位世界顶级的商业分析师和产品专家，拥有丰富的商业模式设计经验和市场分析能力。你的任务是深度分析用户的商业想法，生成多个高质量的典型应用场景。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await this.callAI(messages, 0.8);
        return this.parseScenariosResponse(response);
    }

    /**
     * 生成初步商业分析报告
     */
    async generatePreliminaryReport(scenario: BusinessScenario, originalInput: AIAnalysisRequest): Promise<PreliminaryReport> {
        const prompt = this.buildReportPrompt(scenario, originalInput);

        const messages: AIMessage[] = [
            {
                role: 'system',
                content: '你是一位世界顶级的商业咨询顾问，专精于市场分析、竞争分析和商业模式设计。请基于给定的商业场景，生成专业的初步分析报告。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await this.callAI(messages, 0.6);
        return this.parseReportResponse(response, scenario);
    }

    /**
     * 构建场景分析提示词
     */
    private buildScenarioAnalysisPrompt(request: AIAnalysisRequest): string {
        return `
请首先评估以下用户输入的商业想法质量，然后决定是否进行分析。请采用宽松的标准，尽量帮助用户进行商业分析。

用户输入信息：
${request.targetUsers ? `目标用户: ${request.targetUsers}` : '目标用户: 待定'}
${request.scenario ? `使用场景: ${request.scenario}` : '使用场景: 待定'}
${request.price ? `价格范围: ${request.price}` : '价格范围: 待定'}
核心需求: ${request.coreNeed}

请按以下步骤处理：

步骤1 - 质量评估：
只有在以下极端情况下才拒绝分析：
- 核心需求描述少于2个字符（完全没有意义）
- 内容完全无法理解（如乱码、无意义字符）
- 明显的测试输入或恶意的无意义内容

步骤2 - 正常分析：
对于绝大多数有价值的输入，请继续分析并生成3-5个高质量的商业应用场景。

拒绝信息格式（仅用于极端无意义输入）：
{
  "shouldAnalyze": false,
  "reason": "具体拒绝原因",
  "suggestion": "改进建议"
}

正常分析格式：
{
  "shouldAnalyze": true,
  "scenarios": [
    {
      "title": "场景标题",
      "description": "详细描述",
      "targetUsers": "目标用户",
      "scenario": "使用场景",
      "price": "定价策略",
      "marketPotential": 8,
      "competitionLevel": 6,
      "executionDifficulty": 5,
      "keyAdvantages": ["优势1", "优势2", "优势3"],
      "potentialRisks": ["风险1", "风险2", "风险3"],
      "estimatedMarketSize": "市场规模估算",
      "score": 85
    }
  ]
}

每个场景需要包含：
1. 场景标题（简洁明了，突出商业价值）
2. 场景描述（200字左右，详细描述商业模式）
3. 目标用户群体（具体描述用户特征）
4. 具体使用场景（详细描述用户在什么情况下使用）
5. 定价策略（具体的收费方式和价格范围）
6. 市场潜力评估（1-10分，10分为最高）
7. 竞争激烈程度（1-10分，10分为最高）
8. 执行难度（1-10分，10分为最难）
9. 核心竞争优势（3-5个关键优势）
10. 潜在风险（3-5个主要风险）
11. 估算市场规模
12. 总体评分（1-100）

请确保每个场景都有显著差异，代表不同的商业策略和切入点。回答时要体现世界级的专业商业分析水准。
`;
    }

    /**
     * 构建报告生成提示词
     */
    private buildReportPrompt(scenario: BusinessScenario, originalInput: AIAnalysisRequest): string {
        return `
基于以下商业场景，请生成一份专业的初步商业分析报告：

商业场景：
标题：${scenario.title}
描述：${scenario.description}
目标用户：${scenario.targetUsers}
使用场景：${scenario.scenario}
定价策略：${scenario.price}

用户原始输入：
核心需求：${originalInput.coreNeed}
${originalInput.targetUsers ? `目标用户：${originalInput.targetUsers}` : ''}
${originalInput.scenario ? `使用场景：${originalInput.scenario}` : ''}
${originalInput.price ? `价格预期：${originalInput.price}` : ''}

请生成一份详细的分析报告，包含以下四个部分：

1. 市场分析
   - 市场规模估算（具体数字和增长率）
   - 目标人群画像（年龄、收入、行为特征）
   - 核心痛点分析（3-5个关键痛点）

2. 竞争分析
   - 主要竞争对手类型（直接竞争、间接竞争）
   - 差异化策略（如何与竞争对手区分）
   - 核心竞争优势（3-5个关键优势）

3. 产品策略
   - 核心功能规划（3-5个关键功能）
   - 独特价值主张（一句话描述核心价值）
   - 开发阶段规划（3个主要阶段）

4. 盈利模式
   - 主要收入来源（最主要的盈利方式）
   - 定价策略说明（具体的定价逻辑）
   - 多元化收入渠道（3-5个可能的收入来源）

5. 风险评估
   - 市场风险（3-4个主要市场风险）
   - 执行风险（3-4个关键执行风险）
   - 风险缓解策略（对应的风险应对方案）

请确保分析的专业性和深度，体现世界级商业咨询水准。

请按以下JSON格式返回：
{
  "marketAnalysis": {
    "marketSize": "市场规模估算",
    "growthRate": "年增长率",
    "targetDemographics": "目标人群描述",
    "painPoints": ["痛点1", "痛点2", "痛点3"]
  },
  "competitionAnalysis": {
    "competitorTypes": ["竞争者类型1", "竞争者类型2"],
    "differentiationStrategy": "差异化策略描述",
    "competitiveAdvantages": ["优势1", "优势2", "优势3"]
  },
  "productStrategy": {
    "coreFeatures": ["功能1", "功能2", "功能3"],
    "uniqueValueProposition": "独特价值主张",
    "developmentPhases": ["阶段1", "阶段2", "阶段3"]
  },
  "revenueModel": {
    "primaryRevenue": "主要收入来源",
    "pricingStrategy": "定价策略",
    "revenueStreams": ["收入流1", "收入流2", "收入流3"]
  },
  "risks": {
    "marketRisks": ["风险1", "风险2", "风险3"],
    "executionRisks": ["风险1", "风险2", "风险3"],
    "mitigationStrategies": ["策略1", "策略2", "策略3"]
  }
}
`;
    }

    /**
     * 解析场景分析响应
     */
    private parseScenariosResponse(response: string): AIAnalysisResult {
        try {
            // 尝试提取JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('无法解析AI响应格式');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // 检查是否应该分析
            if (parsed.shouldAnalyze === false) {
                return {
                    shouldAnalyze: false,
                    reason: parsed.reason || '输入内容不足以进行有效分析',
                    suggestion: parsed.suggestion || '请提供更详细的商业想法描述'
                };
            }

            // 正常分析逻辑
            if (!parsed.scenarios || !Array.isArray(parsed.scenarios)) {
                throw new Error('AI响应格式错误：缺少场景数据');
            }

            return parsed.scenarios.map((scenario: any, index: number) => ({
                id: `scenario_${index + 1}`,
                title: scenario.title || `商业场景${index + 1}`,
                description: scenario.description || '',
                targetUsers: scenario.targetUsers || '',
                scenario: scenario.scenario || '',
                price: scenario.price || '',
                marketPotential: Math.max(1, Math.min(10, scenario.marketPotential || 5)),
                competitionLevel: Math.max(1, Math.min(10, scenario.competitionLevel || 5)),
                executionDifficulty: Math.max(1, Math.min(10, scenario.executionDifficulty || 5)),
                keyAdvantages: Array.isArray(scenario.keyAdvantages) ? scenario.keyAdvantages : [],
                potentialRisks: Array.isArray(scenario.potentialRisks) ? scenario.potentialRisks : [],
                estimatedMarketSize: scenario.estimatedMarketSize || '待评估',
                confidence: Math.max(1, Math.min(100, scenario.confidence || 70))
            }));
        } catch (error) {
            console.error('解析场景响应失败:', error);
            // 返回默认场景
            return this.getDefaultScenarios();
        }
    }

    /**
     * 解析报告响应
     */
    private parseReportResponse(response: string, scenario: BusinessScenario): PreliminaryReport {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('无法解析报告响应格式');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                scenarioId: scenario.id,
                marketAnalysis: {
                    marketSize: parsed.marketAnalysis?.marketSize || '待评估',
                    growthRate: parsed.marketAnalysis?.growthRate || '待评估',
                    targetDemographics: parsed.marketAnalysis?.targetDemographics || '',
                    painPoints: Array.isArray(parsed.marketAnalysis?.painPoints) ? parsed.marketAnalysis.painPoints : []
                },
                competitionAnalysis: {
                    competitorTypes: Array.isArray(parsed.competitionAnalysis?.competitorTypes) ? parsed.competitionAnalysis.competitorTypes : [],
                    differentiationStrategy: parsed.competitionAnalysis?.differentiationStrategy || '',
                    competitiveAdvantages: Array.isArray(parsed.competitionAnalysis?.competitiveAdvantages) ? parsed.competitionAnalysis.competitiveAdvantages : []
                },
                productStrategy: {
                    coreFeatures: Array.isArray(parsed.productStrategy?.coreFeatures) ? parsed.productStrategy.coreFeatures : [],
                    uniqueValueProposition: parsed.productStrategy?.uniqueValueProposition || '',
                    developmentPhases: Array.isArray(parsed.productStrategy?.developmentPhases) ? parsed.productStrategy.developmentPhases : []
                },
                revenueModel: {
                    primaryRevenue: parsed.revenueModel?.primaryRevenue || '',
                    pricingStrategy: parsed.revenueModel?.pricingStrategy || '',
                    revenueStreams: Array.isArray(parsed.revenueModel?.revenueStreams) ? parsed.revenueModel.revenueStreams : []
                },
                risks: {
                    marketRisks: Array.isArray(parsed.risks?.marketRisks) ? parsed.risks.marketRisks : [],
                    executionRisks: Array.isArray(parsed.risks?.executionRisks) ? parsed.risks.executionRisks : [],
                    mitigationStrategies: Array.isArray(parsed.risks?.mitigationStrategies) ? parsed.risks.mitigationStrategies : []
                }
            };
        } catch (error) {
            console.error('解析报告响应失败:', error);
            return this.getDefaultReport(scenario.id);
        }
    }

    /**
     * 获取默认场景（降级方案）
     */
    private getDefaultScenarios(): BusinessScenario[] {
        return [
            {
                id: 'default_1',
                title: '基础服务平台',
                description: '基于用户核心需求的基础服务平台模式',
                targetUsers: '目标用户群体',
                scenario: '具体使用场景',
                price: '待定价格策略',
                marketPotential: 5,
                competitionLevel: 5,
                executionDifficulty: 5,
                keyAdvantages: ['核心优势1', '核心优势2'],
                potentialRisks: ['主要风险1', '主要风险2'],
                estimatedMarketSize: '待评估',
                confidence: 70
            }
        ];
    }

    /**
     * 获取默认报告（降级方案）
     */
    private getDefaultReport(scenarioId: string): PreliminaryReport {
        return {
            scenarioId,
            marketAnalysis: {
                marketSize: '市场规模待详细分析',
                growthRate: '增长率待评估',
                targetDemographics: '目标用户待详细分析',
                painPoints: ['核心痛点待识别']
            },
            competitionAnalysis: {
                competitorTypes: ['竞争对手类型待分析'],
                differentiationStrategy: '差异化策略待制定',
                competitiveAdvantages: ['竞争优势待确认']
            },
            productStrategy: {
                coreFeatures: ['核心功能待规划'],
                uniqueValueProposition: '价值主张待明确',
                developmentPhases: ['开发阶段待规划']
            },
            revenueModel: {
                primaryRevenue: '主要收入待确定',
                pricingStrategy: '定价策略待设计',
                revenueStreams: ['收入渠道待分析']
            },
            risks: {
                marketRisks: ['市场风险待评估'],
                executionRisks: ['执行风险待识别'],
                mitigationStrategies: ['风险缓解策略待制定']
            }
        };
    }
}

// 导出单例实例
export const aiService = new AIService();
export default aiService;