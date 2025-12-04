import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';
import { BusinessIdea } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessIdea }: { businessIdea: BusinessIdea } = body;

    if (!businessIdea || !businessIdea.coreNeed) {
      return NextResponse.json(
        { error: '缺少必要的业务想法信息' },
        { status: 400 }
      );
    }

    // 调用AI服务进行分析
    const suggestions = await aiService.analyzeBusinessIdea({
      targetUsers: businessIdea.targetUsers && businessIdea.targetUsers !== 'not_sure' ? businessIdea.targetUsers : undefined,
      scenario: businessIdea.scenario && businessIdea.scenario !== 'not_sure' ? businessIdea.scenario : undefined,
      price: businessIdea.price && businessIdea.price !== 'not_sure' ? businessIdea.price : undefined,
      coreNeed: businessIdea.coreNeed
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI分析API错误:', error);
    return NextResponse.json(
      { error: 'AI分析服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
}