import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envStatus = {
      hasApiKey: !!process.env.DOUBAO_API_KEY,
      hasModel: !!process.env.DOUBAO_MODEL,
      hasUrl: !!process.env.DOUBAO_URL,
      model: process.env.DOUBAO_MODEL,
      url: process.env.DOUBAO_URL,
      apiKeyPrefix: process.env.DOUBAO_API_KEY?.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(envStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}