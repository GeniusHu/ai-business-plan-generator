// ============================================================================
// 豆包大模型 API 调用工具 - 类似于Android中的网络请求工具类
// ============================================================================

/**
 * 豆包 AI 消息接口定义
 */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';     // 消息角色：系统、用户、助手
  content: string;                             // 消息内容
}

/**
 * AI 响应结果接口
 */
export interface AIResponse {
  success: boolean;                            // 请求是否成功
  content?: string;                             // AI生成的内容
  error?: string;                               // 错误信息
}

/**
 * 调用豆包大模型API
 * 类似于Android中的Retrofit网络请求
 *
 * @param messages 消息列表
 * @returns AI响应结果
 */
export async function callDoubaoAPI(messages: AIMessage[]): Promise<AIResponse> {
  try {
    // 从环境变量获取配置
    const apiKey = process.env.DOUBAO_API_KEY;
    const model = process.env.DOUBAO_MODEL;
    const apiUrl = process.env.DOUBAO_URL;

    // 验证配置是否存在
    if (!apiKey || !model || !apiUrl) {
      return {
        success: false,
        error: '豆包API配置缺失'
      };
    }

    // 发送HTTP请求到豆包API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,                       // 创造性：0.7（中等创造性）
        max_tokens: 2000,                        // 最大token数
        stream: false                            // 非流式响应
      })
    });

    // 检查HTTP响应状态
    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: `API请求失败: ${response.status} - ${errorData}`
      };
    }

    // 解析响应数据
    const data = await response.json();

    // 检查响应格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        success: false,
        error: 'API响应格式错误'
      };
    }

    // 返回成功结果
    return {
      success: true,
      content: data.choices[0].message.content.trim()
    };

  } catch (error) {
    // 错误处理
    console.error('豆包API调用错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 生成商业模式画布内容
 * 基于用户回答的5个核心问题，使用AI生成完整的商业模式画布
 *
 * @param productDescription 产品描述
 * @param targetUsers 目标用户
 * @param painPoints 核心痛点
 * @param mvpFeatures MVP功能
 * @param revenueModel 盈利模式
 * @returns 商业模式画布内容
 */
export async function generateBusinessCanvas(
  productDescription: string,
  targetUsers: string[],
  painPoints: string[],
  mvpFeatures: string[],
  revenueModel: string[]
): Promise<AIResponse> {
  // 构建提示词
  const systemPrompt = `你是一个专业的商业顾问，擅长为创业者分析商业模式。请基于用户输入的信息，生成一个完整的商业模式画布(Business Model Canvas)。

请按照以下格式输出JSON：
{
  "valueProposition": ["价值主张1", "价值主张2"],
  "customerSegments": ["客户细分1", "客户细分2"],
  "channels": ["渠道通路1", "渠道通路2"],
  "keyFeatures": ["核心功能1", "核心功能2"],
  "costStructure": ["成本结构1", "成本结构2"],
  "revenueStreams": ["收入来源1", "收入来源2"]
}

要求：
1. 每个数组包含3-5个关键点
2. 内容要具体、可执行
3. 符合小程序/APP创业项目的特点
4. 直接输出JSON，不要其他文字`;

  const userPrompt = `产品信息：
- 产品描述：${productDescription}
- 目标用户：${targetUsers.join(', ')}
- 核心痛点：${painPoints.join(', ')}
- MVP功能：${mvpFeatures.join(', ')}
- 盈利模式：${revenueModel.join(', ')}`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  return callDoubaoAPI(messages);
}

/**
 * 生成完整商业计划书
 * 基于商业模式画布，生成详细的商业计划书内容
 *
 * @param canvasData 商业模式画布数据
 * @param projectType 项目类型（小程序/APP/跨端）
 * @param industry 所属行业
 * @returns 商业计划书内容
 */
export async function generateBusinessPlan(
  canvasData: any,
  projectType: string,
  industry: string
): Promise<AIResponse> {
  const systemPrompt = `你是一个专业的商业计划书撰写专家，请基于提供的商业模式画布，生成一份完整的小程序/APP商业计划书。

请按照以下结构输出：
1. 项目简介
2. 市场分析（包含市场容量、竞争分析）
3. 用户分析（用户画像、需求分析）
4. 产品架构（功能模块、技术栈建议）
5. 商业模式（详细的盈利模式说明）
6. 版本路线图（V1.0-V2.0发展计划）
7. 风险评估（技术风险、市场风险、运营风险）
8. 盈利预测（简单的收入模型）

要求：
- 内容要专业、实用
- 符合${projectType}项目的特点
- 针对${industry}行业的特性
- 字数控制在2000字以内`;

  const userPrompt = `商业模式画布数据：
${JSON.stringify(canvasData, null, 2)}

项目类型：${projectType}
所属行业：${industry}`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  return callDoubaoAPI(messages);
}

/**
 * 智能推荐功能
 * 根据行业和项目类型，推荐常见的目标用户、痛点、功能等
 *
 * @param industry 所属行业
 * @param projectType 项目类型
 * @param recommendationType 推荐类型：users/painPoints/features/revenueModels
 * @returns 推荐内容列表
 */
export async function getRecommendations(
  industry: string,
  projectType: string,
  recommendationType: 'users' | 'painPoints' | 'features' | 'revenueModels'
): Promise<AIResponse> {
  const promptMap = {
    users: '目标用户群体',
    painPoints: '用户核心痛点',
    features: '产品核心功能',
    revenueModels: '盈利模式'
  };

  const systemPrompt = `你是一个${industry}行业的专家，请针对${projectType}项目，推荐5-8个${promptMap[recommendationType]}。

要求：
- 内容要具体、实用
- 符合行业特点
- 每项用简洁的语言描述
- 直接返回数组格式的JSON字符串

格式：["项目1", "项目2", "项目3"]`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请为${industry}行业的${projectType}项目推荐${promptMap[recommendationType]}` }
  ];

  return callDoubaoAPI(messages);
}