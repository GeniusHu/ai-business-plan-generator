/**
 * 客户端AI服务调用
 * 通过API路由调用豆包AI，避免环境变量访问问题
 */

export interface AIAnalysisRequest {
    targetUsers?: string;
    scenario?: string;
    price?: string;
    coreNeed: string;
}

export interface AnalysisResponse {
    success: boolean;
    suggestions?: any[];
    errorCode?: string;
    message?: string;
    suggestion?: string;
}

export interface ReportResponse {
    report: any;
}

export class AIClientService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : '';
    }

    /**
     * 分析商业想法
     */
    async analyzeBusinessIdea(request: AIAnalysisRequest): Promise<AnalysisResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/ai/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessIdea: request }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API调用失败');
            }

            return await response.json();
        } catch (error) {
            console.error('客户端AI调用失败:', error);
            throw error;
        }
    }

    /**
     * 生成分析报告
     */
    async generateReport(scenario: any, businessIdea: AIAnalysisRequest): Promise<ReportResponse> {
        try {
            console.log('🤖 aiClientService.generateReport 开始执行');
            console.log('📤 发送的场景数据:', scenario);
            console.log('📤 发送的商业想法:', businessIdea);
            console.log('🌐 请求URL:', `${this.baseUrl}/api/ai/report`);

            const response = await fetch(`${this.baseUrl}/api/ai/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenario, businessIdea }),
            });

            console.log('📡 API响应状态:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API调用失败，错误数据:', errorData);
                throw new Error(errorData.error || 'API调用失败');
            }

            const result = await response.json();
            console.log('✅ 报告生成成功，响应数据:', result);
            return result;
        } catch (error) {
            console.error('💥 客户端报告生成失败，详细错误:', error);
            console.error('❌ 错误类型:', error.constructor.name);
            console.error('❌ 错误消息:', error.message);
            throw error;
        }
    }
}

// 导出单例实例
export const aiClientService = new AIClientService();
export default aiClientService;