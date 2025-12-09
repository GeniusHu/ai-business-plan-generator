import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';
import { BusinessScenario } from '@/types';

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 /api/ai/report API路由被调用');

    const body = await req.json();
    console.log('📥 接收到的请求体:', body);

    const { scenario, businessIdea }: { scenario: BusinessScenario; businessIdea: any } = body;

    if (!scenario) {
      console.log('❌ 缺少商业场景信息');
      return NextResponse.json(
        { error: '缺少商业场景信息' },
        { status: 400 }
      );
    }

    if (!businessIdea) {
      console.log('❌ 缺少商业想法信息');
      return NextResponse.json(
        { error: '缺少商业想法信息' },
        { status: 400 }
      );
    }

    console.log('🏗️ 开始调用aiService.generatePreliminaryReport');
    console.log('📋 场景数据:', scenario);
    console.log('💭 商业想法:', businessIdea);

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

    console.log('✅ 报告生成成功，返回数据:', report);
    return NextResponse.json({ report });
  } catch (error) {
    console.error('💥 报告生成API错误，详细信息:', error);
    console.error('❌ 错误类型:', error.constructor.name);
    console.error('❌ 错误消息:', error.message);
    console.error('📋 错误堆栈:', error.stack);

    return NextResponse.json(
      {
        error: '报告生成服务暂时不可用，请稍后再试',
        details: error.message
      },
      { status: 500 }
    );
  }
}