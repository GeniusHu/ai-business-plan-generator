import { NextResponse } from 'next/server';
import { analyzeProductCompleteness } from '@/lib/product-analysis';

export async function POST(request: Request) {
  try {
    const productInfo = await request.json();

    // 验证必要的数据
    if (!productInfo) {
      return NextResponse.json(
        { error: '缺少产品信息数据' },
        { status: 400 }
      );
    }

    // 调用AI分析
    const analysis = await analyzeProductCompleteness(productInfo);

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI分析API错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI分析失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}