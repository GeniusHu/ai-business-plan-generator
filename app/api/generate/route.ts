import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { questions, projectType, industry } = await request.json();

    // 构建AI提示词
    const prompt = buildPrompt(questions, projectType, industry);

    try {
      // 调用豆包AI服务
      const canvasData = await callAIService(prompt, { questions, projectType, industry });

      return NextResponse.json({
        success: true,
        data: canvasData
      });
    } catch (error) {
      console.error('AI服务调用失败，使用备用方案:', error);
      // 备用方案：基于规则的生成
      const canvasData = generateBusinessModelCanvas(questions, projectType, industry);

      return NextResponse.json({
        success: true,
        data: canvasData,
        fallback: true // 标识使用了备用方案
      });
    }
  } catch (error) {
    console.error('AI生成失败:', error);
    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    );
  }
}

function generateBusinessModelCanvas(questions: any, projectType: string, industry: string) {
  const { targetUsers, painPoints, productDescription, revenueModel, mvpFeatures } = questions;

  // 基于行业和用户答案生成价值主张
  const valueProposition = [
    `为${targetUsers.join('、')}提供${productDescription}`,
    '简单易用的用户体验',
    '个性化的功能定制',
    '高性价比的解决方案'
  ].filter(Boolean);

  // 生成客户细分
  const customerSegments = targetUsers.length > 0 ? targetUsers : ['默认用户群体'];

  // 生成渠道通路
  const channels = [
    projectType === 'mini-program' ? '微信小程序' : '应用商店',
    '社交媒体推广',
    '口碑传播',
    '搜索引擎优化',
    '合作伙伴渠道'
  ];

  // 生成核心功能
  const keyFeatures = mvpFeatures.length > 0 ? mvpFeatures : [
    '用户注册登录',
    '核心功能模块',
    '个人中心',
    '搜索功能'
  ];

  // 生成成本结构
  const costStructure = [
    '技术研发成本',
    '服务器和基础设施',
    '市场推广费用',
    '运营人员成本',
    '客户服务成本'
  ];

  // 生成收入来源
  const revenueStreams = revenueModel.length > 0 ? revenueModel : ['广告收入', '增值服务'];

  return {
    valueProposition,
    customerSegments,
    channels,
    keyFeatures,
    costStructure,
    revenueStreams
  };
}

// 构建AI提示词
function buildPrompt(questions: any, projectType: string, industry: string) {
  return `
作为一个专业的商业分析师，请基于以下项目信息，生成一个完整的商业模式画布：

项目类型：${projectType === 'mini-program' ? '小程序' : projectType === 'app' ? 'APP' : '跨端应用'}
所属行业：${industry}
产品描述：${questions.productDescription}
目标用户：${questions.targetUsers.join('、')}
用户痛点：${questions.painPoints.join('、')}
MVP功能：${questions.mvpFeatures.join('、')}
盈利模式：${questions.revenueModel.join('、')}

请分析这个项目，生成专业的商业模式画布内容，包括：
1. 价值主张 - 项目的核心价值点和竞争优势
2. 客户细分 - 主要的目标客户群体
3. 渠道通路 - 如何触达和服务客户
4. 核心功能 - MVP版本应包含的关键功能
5. 成本结构 - 主要的成本构成
6. 收入来源 - 商业变现方式

请确保内容专业、具体、可执行，并符合该行业的最佳实践。
  `.trim();
}

// 豆包AI集成
async function callAIService(prompt: string, context: any) {
  const DOUBAO_API_KEY = 'xxxx';
  const DOUBAO_MODEL = 'doubao-1-5-pro-256k-250115';
  const DOUBAO_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

  try {
    const response = await fetch(DOUBAO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DOUBAO_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的商业分析师，擅长分析商业模式和制定商业计划。请基于用户输入的信息，生成专业的商业模式画布内容。返回格式必须是JSON对象，包含以下字段：valueProposition（价值主张数组）、customerSegments（客户细分数组）、channels（渠道通路数组）、keyFeatures（核心功能数组）、costStructure（成本结构数组）、revenueStreams（收入来源数组）。每个数组包含3-5个具体的要点。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('豆包API调用失败:', data);
      throw new Error(`API调用失败: ${response.status}`);
    }

    const aiResponse = data.choices[0].message.content;

    // 尝试解析AI返回的JSON内容
    try {
      // 提取JSON部分（AI可能返回带有解释的文本）
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // 如果没有找到JSON，创建一个基于文本的结构化响应
      return parseTextResponse(aiResponse, context);
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError);
      return parseTextResponse(aiResponse, context);
    }
  } catch (error) {
    console.error('豆包AI服务调用失败:', error);
    // 返回基于规则的备用方案
    return generateBusinessModelCanvas(context.questions, context.projectType, context.industry);
  }
}

// 解析文本响应的备用函数
function parseTextResponse(text: string, context: any) {
  const lines = text.split('\n').filter(line => line.trim());

  return {
    valueProposition: extractPoints(lines, ['价值主张', '核心价值']) || [
      `为${context.questions.targetUsers.join('、')}提供${context.questions.productDescription}`,
      '简单易用的用户体验',
      '个性化的功能定制'
    ],
    customerSegments: extractPoints(lines, ['客户细分', '目标用户']) || context.questions.targetUsers,
    channels: extractPoints(lines, ['渠道', '推广']) || ['线上推广', '社交媒体', '口碑传播'],
    keyFeatures: extractPoints(lines, ['功能', '特性']) || context.questions.mvpFeatures,
    costStructure: extractPoints(lines, ['成本', '费用']) || ['技术研发', '运营成本', '市场推广'],
    revenueStreams: extractPoints(lines, ['收入', '盈利']) || context.questions.revenueModel
  };
}

// 从文本中提取要点
function extractPoints(lines: string[], keywords: string[]): string[] {
  const result: string[] = [];
  let isInTargetSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 检查是否是目标部分标题
    if (keywords.some(keyword => trimmedLine.includes(keyword))) {
      isInTargetSection = true;
      continue;
    }

    // 检查是否是其他部分标题（如果是，则跳出当前部分）
    if (isInTargetSection && (
      trimmedLine.includes('价值主张') || trimmedLine.includes('客户细分') ||
      trimmedLine.includes('渠道') || trimmedLine.includes('功能') ||
      trimmedLine.includes('成本') || trimmedLine.includes('收入')
    ) && !keywords.some(keyword => trimmedLine.includes(keyword))) {
      isInTargetSection = false;
      continue;
    }

    // 提取列表项
    if (isInTargetSection && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || /^\d+\./.test(trimmedLine))) {
      const point = trimmedLine.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (point) result.push(point);
    }
  }

  return result.slice(0, 5); // 最多返回5个要点
}