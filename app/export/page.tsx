'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { Download, ArrowLeft, FileText, Code, Share, Check, Lightbulb } from 'lucide-react';

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useProject();

  const format = searchParams.get('format') as 'html' | 'pdf' | 'word' || 'html';
  const projectData = state.projectData;

  useEffect(() => {
    if (format === 'html' && projectData) {
      handleExportHtml();
    }
  }, [format, projectData]);

  // Early return after all hooks are called
  if (!projectData) {
    return <div>加载中...</div>;
  }

  const generateHtmlContent = () => {
    const { questions, canvas, type, industry, name } = projectData;

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - 商业计划书</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f9fafb;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #e5e7eb;
        }

        .title {
            font-size: 36px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 20px;
            color: #6b7280;
            margin-bottom: 20px;
        }

        .meta {
            display: flex;
            justify-content: center;
            gap: 30px;
            font-size: 14px;
            color: #9ca3af;
        }

        h2 {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }

        h3 {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            margin-top: 25px;
            margin-bottom: 10px;
        }

        ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }

        li {
            margin-bottom: 8px;
            color: #4b5563;
        }

        .feature-list {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .roadmap {
            display: grid;
            gap: 20px;
            margin: 20px 0;
        }

        .phase {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            border-radius: 0 8px 8px 0;
        }

        .risk {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px 20px;
            border-radius: 0 8px 8px 0;
            margin: 10px 0;
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }

        @media print {
            body { background-color: white; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${name}</h1>
        <p class="subtitle">商业计划书</p>
        <div class="meta">
            <span>项目类型: ${type === 'mini-program' ? '小程序' : type === 'app' ? 'APP' : '跨端应用'}</span>
            <span>生成时间: ${new Date().toLocaleDateString('zh-CN')}</span>
        </div>
    </div>

    <h2>1. 项目简介</h2>
    <p><strong>项目类型:</strong> ${type === 'mini-program' ? '小程序' : type === 'app' ? 'APP' : '跨端应用'}</p>
    <p><strong>所属行业:</strong> ${industry}</p>
    <p><strong>产品描述:</strong> ${questions.productDescription}</p>

    <h2>2. 市场分析</h2>
    <h3>目标用户群体</h3>
    <ul>${questions.targetUsers.map(user => `<li>${user}</li>`).join('')}</ul>

    <h3>市场痛点</h3>
    <ul>${questions.painPoints.map(pain => `<li>${pain}</li>`).join('')}</ul>

    <h2>3. 产品架构</h2>
    <h3>MVP功能清单</h3>
    <div class="feature-list">
        <ul>${questions.mvpFeatures.length > 0
          ? questions.mvpFeatures.map(feature => `<li>${feature}</li>`).join('')
          : '<li>用户注册登录</li><li>核心功能模块</li><li>个人中心</li><li>搜索功能</li>'
        }</ul>
    </div>

    <h3>技术架构建议</h3>
    <ul>
        <li><strong>前端:</strong> ${type === 'mini-program' ? '微信小程序原生开发' : type === 'app' ? 'React Native/Flutter' : '跨端开发框架'}</li>
        <li><strong>后端:</strong> Node.js + Express 或 Java Spring Boot</li>
        <li><strong>数据库:</strong> MySQL/PostgreSQL + Redis</li>
        <li><strong>部署:</strong> 云服务器 (阿里云/腾讯云)</li>
    </ul>

    <h2>4. 商业模式</h2>
    <h3>价值主张</h3>
    <ul>${canvas.valueProposition.map(vp => `<li>${vp}</li>`).join('')}</ul>

    <h3>收入模式</h3>
    <ul>${questions.revenueModel.map(model => `<li>${model}</li>`).join('')}</ul>

    <h3>成本结构</h3>
    <ul>${canvas.costStructure.map(cost => `<li>${cost}</li>`).join('')}</ul>

    <h2>5. 版本路线图</h2>
    <div class="roadmap">
        <div class="phase">
            <h3>第一阶段 (1.0 - 3个月)</h3>
            <ul>
                <li>完成MVP功能开发</li>
                <li>小规模用户测试</li>
                <li>基础运营体系建设</li>
            </ul>
        </div>

        <div class="phase">
            <h3>第二阶段 (2.0 - 6个月)</h3>
            <ul>
                <li>核心功能优化</li>
                <li>用户规模扩展</li>
                <li>商业化模式验证</li>
            </ul>
        </div>

        <div class="phase">
            <h3>第三阶段 (3.0 - 12个月)</h3>
            <ul>
                <li>功能模块完善</li>
                <li>市场推广加速</li>
                <li>盈利模式优化</li>
            </ul>
        </div>
    </div>

    <h2>6. 风险评估</h2>
    <div class="risk">
        <h3>主要风险</h3>
        <ul>
            <li><strong>技术风险:</strong> 开发进度延期，技术难度超出预期</li>
            <li><strong>市场风险:</strong> 用户接受度不高，竞争激烈</li>
            <li><strong>运营风险:</strong> 用户获取成本过高，留存率低</li>
        </ul>
    </div>

    <div class="risk">
        <h3>风险应对策略</h3>
        <ul>
            <li>采用敏捷开发，快速迭代验证</li>
            <li>深入用户调研，精准定位需求</li>
            <li>多渠道推广，控制获客成本</li>
        </ul>
    </div>

    <div class="footer">
        <p>本报告由AI商业计划书生成器自动生成</p>
        <p>建议结合实际情况进行调整完善</p>
    </div>
</body>
</html>
    `.trim();
  };

  const handleExportHtml = () => {
    setIsExporting(true);

    // 创建HTML内容
    const htmlContent = generateHtmlContent();

    // 创建Blob对象
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    setExportedUrl(url);

    // 自动下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name}_商业计划书.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  const handleExportPdf = () => {
    alert('PDF导出功能开发中，请先使用HTML导出');
  };

  const handleExportWord = () => {
    alert('Word导出功能开发中，请先使用HTML导出');
  };

  const exportOptions = [
    {
      id: 'html',
      title: 'HTML格式',
      description: '适用于网页浏览和分享',
      icon: <Code className="w-8 h-8 text-orange-500" />,
      available: true,
      onClick: handleExportHtml
    },
    {
      id: 'pdf',
      title: 'PDF格式',
      description: '适用于打印和正式文档',
      icon: <FileText className="w-8 h-8 text-red-500" />,
      available: false,
      onClick: handleExportPdf
    },
    {
      id: 'word',
      title: 'Word格式',
      description: '适用于编辑和协作',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      available: false,
      onClick: handleExportWord
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            导出商业计划书
          </h1>
          <p className="text-gray-600">
            选择你需要的导出格式，下载完整的商业计划文档
          </p>
        </div>

        {/* 导出选项 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-gray-200 rounded-xl p-6 ${
                option.available
                  ? 'hover:border-blue-300'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={option.available ? option.onClick : undefined}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  {option.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                {option.description}
              </p>

              {option.available ? (
                <Button className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  导出 {option.id.toUpperCase()}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  开发中
                </Button>
              )}

              {format === option.id && isExporting && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-2" />
                    导出成功！
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 文档信息 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-blue-900">
              文档信息
            </h3>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">项目名称:</span>
                <span className="ml-2 text-blue-700">{projectData.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">项目类型:</span>
                <span className="ml-2 text-blue-700">
                  {projectData.type === 'mini-program' ? '小程序' :
                   projectData.type === 'app' ? 'APP' : '跨端应用'}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">所属行业:</span>
                <span className="ml-2 text-blue-700">{projectData.industry}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">生成时间:</span>
                <span className="ml-2 text-blue-700">
                  {new Date(projectData.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-blue-600">
              <Lightbulb className="w-4 h-4 inline mr-2 text-blue-500" />
              提示: HTML格式可在浏览器中直接打开，也适合打印和分享</p>
            </div>
          </CardContent>
        </Card>

        {/* 底部操作 */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => router.push('/preview')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回预览
          </Button>

          <Button onClick={() => router.push('/profile')}>
            <Share className="w-5 h-5 mr-2" />
            保存项目
          </Button>
        </div>
      </div>
    </div>
  );
}