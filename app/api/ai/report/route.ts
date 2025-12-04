import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';
import { BusinessScenario } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenario, businessIdea }: { scenario: BusinessScenario; businessIdea: any } = body;

    if (!scenario) {
      return NextResponse.json(
        { error: '缺少商业场景信息' },
        { status: 400 }
      );
    }

    if (!businessIdea) {
      return NextResponse.json(
        { error: '缺少商业想法信息' },
        { status: 400 }
      );
    }

    // 生成详细分析报告
    const report = await aiService.generatePreliminaryReport(
      scenario,
      {
        targetUsers: businessIdea.targetUsers && businessIdea.targetUsers !== 'not_sure' ? businessIdea.targetUsers : undefined,
        scenario: businessIdea.scenario && businessIdea.scenario !== 'not_sure' ? businessIdea.scenario : undefined,
        price: businessIdea.price && businessIdea.price !== 'not_sure' ? businessIdea.price : undefined,
        coreNeed: businessIdea.coreNeed
      }
    );

    return NextResponse.json({ report });
  } catch (error) {
    console.error('报告生成API错误:', error);
    return NextResponse.json(
      { error: '报告生成服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
}