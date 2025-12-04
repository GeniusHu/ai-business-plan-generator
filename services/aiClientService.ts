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
    suggestions: any[];
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
            const response = await fetch(`${this.baseUrl}/api/ai/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenario, businessIdea }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API调用失败');
            }

            return await response.json();
        } catch (error) {
            console.error('客户端报告生成失败:', error);
            throw error;
        }
    }
}

// 导出单例实例
export const aiClientService = new AIClientService();
export default aiClientService;