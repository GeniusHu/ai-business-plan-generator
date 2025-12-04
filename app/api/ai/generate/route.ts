import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '缺少必要的消息数据' },
        { status: 400 }
      );
    }

    // 调用AI服务生成内容
    const content = await aiService.callAI(messages, 0.7);

    return NextResponse.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('AI生成API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'AI生成服务暂时不可用，请稍后再试'
      },
      { status: 500 }
    );
  }
}