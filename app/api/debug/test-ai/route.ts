import { NextResponse } from 'next/server';
import { callDoubaoAPI } from '@/lib/ai';

export async function GET() {
  try {
    const testMessages = [
      {
        role: 'system' as const,
        content: '你是一个测试助手'
      },
      {
        role: 'user' as const,
        content: '请简单回复"API测试成功"'
      }
    ];

    const result = await callDoubaoAPI(testMessages);

    return NextResponse.json({
      success: result.success,
      content: result.content,
      error: result.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}