import { NextResponse } from 'next/server';
import { generateNextQuestion } from '@/lib/product-analysis';
import { ProductInfo, AIAnalysis } from '@/types';

export async function POST(request: Request) {
  try {
    const { productInfo, aiAnalysis, conversationHistory } = await request.json();

    // 验证必要的数据
    if (!productInfo || !aiAnalysis || !conversationHistory) {
      return NextResponse.json(
        { error: '缺少必要的数据参数' },
        { status: 400 }
      );
    }

    // 调用AI生成下一个问题
    const response = await generateNextQuestion(
      productInfo,
      aiAnalysis,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI对话API错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI对话失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}