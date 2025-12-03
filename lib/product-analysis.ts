// ============================================================================
// 产品构思分析AI服务 - 专业的产品分析AI工具
// ============================================================================

import { callDoubaoAPI, AIMessage } from './ai';
import { ProductInfo, AIAnalysis } from '@/types';

/**
 * 分析产品构思的完整度和质量
 * 基于用户填写的5个步骤信息，进行专业的产品分析
 *
 * @param productInfo 产品构思信息
 * @returns AI分析结果
 */
export async function analyzeProductCompleteness(productInfo: ProductInfo): Promise<AIAnalysis> {
  const systemPrompt = `你是一个经验丰富的产品经理和商业分析师，专门为创业者的产品构思提供专业分析。

请分析用户的产品构思，并按照以下格式输出JSON：
{
  "completeness": 85,
  "missingAspects": [
    "解决方案需要更具体的技术实现细节",
    "盈利模式需要更多市场验证数据"
  ],
  "recommendations": [
    "建议详细说明产品的技术架构和实现路径",
    "可以补充竞品分析和市场定位策略",
    "建议制定用户增长和运营计划"
  ],
  "isReadyToGenerate": false
}

评估标准：
1. completeness (0-100): 基于信息的完整性和质量评分
   - 60-70: 基础信息完整，需要深度补充
   - 71-85: 信息较完整，可以进行轻度优化
   - 86-95: 信息完整，可以开始商业计划生成
   - 96-100: 信息非常完整，可以直接生成高质量商业计划

2. missingAspects: 列出需要补充的具体方面
3. recommendations: 提供3-5个具体的改进建议
4. isReadyToGenerate: completeness >= 80时为true

重点关注：
- 产品描述是否清晰明确
- 用户痛点分析是否深入
- 解决方案是否具有可行性
- 盈利模式是否合理可行
- 是否有差异化竞争优势`;

  const userPrompt = `请分析以下产品构思：

**产品描述：**
${productInfo.productDescription}

**使用场景：**
${productInfo.usageScenario}

**目标用户和痛点：**
${productInfo.targetUsers}

**解决方案：**
${productInfo.solution}

**盈利模式：**
${productInfo.revenueModel}

请基于以上信息进行专业的产品分析，并按照指定的JSON格式输出结果。`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  try {
    const response = await callDoubaoAPI(messages);

    if (!response.success || !response.content) {
      throw new Error(response.error || 'AI分析失败');
    }

    // 解析AI返回的JSON
    let analysisResult: AIAnalysis;
    try {
      analysisResult = JSON.parse(response.content);
    } catch (parseError) {
      console.warn('AI返回格式解析失败，使用默认分析:', parseError);
      // 降级处理
      analysisResult = generateFallbackAnalysis(productInfo);
    }

    return analysisResult;

  } catch (error) {
    console.error('产品分析API调用失败:', error);
    return generateFallbackAnalysis(productInfo);
  }
}

/**
 * 生成AI对话的下一个问题
 * 基于当前的产品信息和分析结果，生成针对性的追问
 *
 * @param productInfo 产品构思信息
 * @param currentAnalysis 当前AI分析结果
 * @param conversationHistory 对话历史
 * @returns AI生成的下一个问题
 */
export async function generateNextQuestion(
  productInfo: ProductInfo,
  currentAnalysis: AIAnalysis,
  conversationHistory: string[]
): Promise<string> {
  const systemPrompt = `你是一个专业的产品顾问，正在通过对话帮助用户完善产品构思。

你的任务是基于用户当前的产品信息和对话历史，生成一个有针对性的追问，帮助用户补充关键信息。

追问原则：
1. 一次只问一个问题，聚焦于最重要的缺失方面
2. 问题要具体、开放，引导用户详细描述
3. 要考虑到用户已经回答过的内容，避免重复
4. 问题要能够帮助提升产品构思的完整度和可行性

问题类型可以包括：
- 技术实现细节
- 市场竞争分析
- 用户获取策略
- 成本结构分析
- 风险评估
- 差异化定位
- 运营策略
- 团队建设等

直接输出具体的问题，不要包含其他文字。`;

  const contextInfo = `
当前产品信息：
- 产品描述：${productInfo.productDescription}
- 使用场景：${productInfo.usageScenario}
- 目标用户：${productInfo.targetUsers}
- 解决方案：${productInfo.solution}
- 盈利模式：${productInfo.revenueModel}

当前分析结果：
- 完整度：${currentAnalysis.completeness}%
- 需要补充：${currentAnalysis.missingAspects.join('、') || '暂无'}
- 建议：${currentAnalysis.recommendations.slice(0, 2).join('、')}

最近对话记录：
${conversationHistory.slice(-3).map((msg, i) => `${i % 2 === 0 ? '用户' : 'AI'}: ${msg}`).join('\n')}`;

  const userPrompt = `请基于以上信息，生成一个有针对性的追问，帮助用户完善产品构思。`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: contextInfo + '\n\n' + userPrompt }
  ];

  try {
    const response = await callDoubaoAPI(messages);

    if (response.success && response.content) {
      return response.content.trim();
    }
  } catch (error) {
    console.error('生成下一个问题失败:', error);
  }

  // 降级问题
  const fallbackQuestions = [
    '能详细说明一下你的产品如何解决用户的核心痛点吗？',
    '你觉得你的产品相比竞争对手有哪些独特优势？',
    '你计划如何验证产品的市场需求和可行性？',
    '在技术实现方面，你预计的主要挑战是什么？'
  ];

  return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
}

/**
 * 降级分析逻辑
 * 当AI分析失败时使用的本地分析逻辑
 */
function generateFallbackAnalysis(productInfo: ProductInfo): AIAnalysis {
  const scores = {
    productDescription: productInfo.productDescription.length > 50 ? 20 : 10,
    usageScenario: productInfo.usageScenario.length > 50 ? 20 : 10,
    targetUsers: productInfo.targetUsers.length > 50 ? 20 : 10,
    solution: productInfo.solution.length > 50 ? 20 : 10,
    revenueModel: productInfo.revenueModel.length > 50 ? 20 : 10
  };

  const completeness = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const missingAspects = [];
  if (productInfo.solution.length < 50) missingAspects.push('解决方案需要更详细');
  if (productInfo.revenueModel.length < 50) missingAspects.push('盈利模式需要具体化');
  if (productInfo.targetUsers.length < 50) missingAspects.push('用户痛点分析不够深入');

  return {
    completeness,
    missingAspects,
    recommendations: [
      '请详细说明你的产品如何解决用户的核心痛点',
      '建议分析你的盈利模式的可行性和竞争优势',
      '可以补充说明产品的技术实现方案和开发难度'
    ],
    isReadyToGenerate: completeness >= 80
  };
}