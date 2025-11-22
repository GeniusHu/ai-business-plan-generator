'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { ArrowLeft, Download, FileText, Share, Edit, Copy } from 'lucide-react';

export default function PreviewPage() {
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const { state } = useProject();

  const projectData = state.projectData;
  if (!projectData) {
    return <div>加载中...</div>;
  }

  const handleExport = (format: 'html' | 'pdf' | 'word') => {
    setIsExporting(true);
    // 这里后续会实现实际的导出功能
    setTimeout(() => {
      setIsExporting(false);
      if (format === 'html') {
        // 导出HTML
        window.open('/export?format=html', '_blank');
      } else {
        alert(`${format.toUpperCase()}导出功能开发中...`);
      }
    }, 1000);
  };

  const handleCopyText = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text).then(() => {
      alert('内容已复制到剪贴板！');
    });
  };

  const generateTextReport = () => {
    const { questions, canvas, type, industry, name } = projectData;

    return `
# ${name} - 商业计划书

## 1. 项目简介

**项目类型**: ${type === 'mini-program' ? '小程序' : type === 'app' ? 'APP' : '跨端应用'}
**所属行业**: ${industry}
**创建时间**: ${new Date(projectData.createdAt).toLocaleDateString('zh-CN')}

### 产品描述
${questions.productDescription}

## 2. 市场分析

### 目标用户群体
${questions.targetUsers.map(user => `• ${user}`).join('\\n')}

### 市场痛点
${questions.painPoints.map(pain => `• ${pain}`).join('\\n')}

## 3. 用户分析

### 核心用户特征
基于目标用户群体分析，我们的核心用户具有以下特征：
- 需求明确，对现有解决方案不满意
- 愿意为更好的体验付费
- 具有一定的社交影响力

## 4. 产品架构

### MVP功能清单
${questions.mvpFeatures.length > 0
  ? questions.mvpFeatures.map(feature => `• ${feature}`).join('\\n')
  : '• 用户注册登录\\n• 核心功能模块\\n• 个人中心\\n• 搜索功能'
}

### 技术架构建议
- **前端**: ${type === 'mini-program' ? '微信小程序原生开发' : type === 'app' ? 'React Native/Flutter' : '跨端开发框架'}
- **后端**: Node.js + Express 或 Java Spring Boot
- **数据库**: MySQL/PostgreSQL + Redis
- **部署**: 云服务器 (阿里云/腾讯云)

## 5. 商业模式

### 价值主张
${canvas.valueProposition.map(vp => `• ${vp}`).join('\\n')}

### 收入模式
${questions.revenueModel.map(model => `• ${model}`).join('\\n')}

### 成本结构
${canvas.costStructure.map(cost => `• ${cost}`).join('\\n')}

## 6. 版本路线图

### 第一阶段 (1.0 - 3个月)
- 完成MVP功能开发
- 小规模用户测试
- 基础运营体系建设

### 第二阶段 (2.0 - 6个月)
- 核心功能优化
- 用户规模扩展
- 商业化模式验证

### 第三阶段 (3.0 - 12个月)
- 功能模块完善
- 市场推广加速
- 盈利模式优化

## 7. 风险评估

### 主要风险
1. **技术风险**: 开发进度延期，技术难度超出预期
2. **市场风险**: 用户接受度不高，竞争激烈
3. **运营风险**: 用户获取成本过高，留存率低

### 风险应对策略
- 采用敏捷开发，快速迭代验证
- 深入用户调研，精准定位需求
- 多渠道推广，控制获客成本

## 8. 团队建议

### 核心团队配置
- **产品经理**: 1名，负责产品规划和项目管理
- **技术开发**: 2-3名，负责前后端开发
- **UI设计师**: 1名，负责界面设计和用户体验
- **运营专员**: 1名，负责用户运营和市场推广

### 外部资源
- 专业法务顾问（合同合规）
- 财务顾问（投融资规划）
- 技术顾问（架构设计）

---

*本报告由AI商业计划书生成器自动生成，建议结合实际情况进行调整完善。*
    `.trim();
  };

  const reportSections = [
    {
      title: '1. 项目简介',
      content: `
        <p><strong>项目类型:</strong> ${projectData.type === 'mini-program' ? '小程序' : projectData.type === 'app' ? 'APP' : '跨端应用'}</p>
        <p><strong>产品描述:</strong> ${projectData.questions.productDescription}</p>
      `
    },
    {
      title: '2. 市场分析',
      content: `
        <h4>目标用户群体</h4>
        <ul>${projectData.questions.targetUsers.map(user => `<li>${user}</li>`).join('')}</ul>

        <h4>市场痛点</h4>
        <ul>${projectData.questions.painPoints.map(pain => `<li>${pain}</li>`).join('')}</ul>
      `
    },
    {
      title: '3. 产品架构',
      content: `
        <h4>MVP功能清单</h4>
        <ul>${projectData.questions.mvpFeatures.length > 0
          ? projectData.questions.mvpFeatures.map(feature => `<li>${feature}</li>`).join('')
          : '<li>用户注册登录</li><li>核心功能模块</li><li>个人中心</li><li>搜索功能</li>'
        }</ul>
      `
    },
    {
      title: '4. 商业模式',
      content: `
        <h4>价值主张</h4>
        <ul>${projectData.canvas.valueProposition.map(vp => `<li>${vp}</li>`).join('')}</ul>

        <h4>收入模式</h4>
        <ul>${projectData.questions.revenueModel.map(model => `<li>${model}</li>`).join('')}</ul>

        <h4>成本结构</h4>
        <ul>${projectData.canvas.costStructure.map(cost => `<li>${cost}</li>`).join('')}</ul>
      `
    },
    {
      title: '5. 版本路线图',
      content: `
        <h4>第一阶段 (1.0 - 3个月)</h4>
        <ul>
          <li>完成MVP功能开发</li>
          <li>小规模用户测试</li>
          <li>基础运营体系建设</li>
        </ul>

        <h4>第二阶段 (2.0 - 6个月)</h4>
        <ul>
          <li>核心功能优化</li>
          <li>用户规模扩展</li>
          <li>商业化模式验证</li>
        </ul>

        <h4>第三阶段 (3.0 - 12个月)</h4>
        <ul>
          <li>功能模块完善</li>
          <li>市场推广加速</li>
          <li>盈利模式优化</li>
        </ul>
      `
    },
    {
      title: '6. 风险评估',
      content: `
        <h4>主要风险</h4>
        <ul>
          <li><strong>技术风险:</strong> 开发进度延期，技术难度超出预期</li>
          <li><strong>市场风险:</strong> 用户接受度不高，竞争激烈</li>
          <li><strong>运营风险:</strong> 用户获取成本过高，留存率低</li>
        </ul>

        <h4>风险应对策略</h4>
        <ul>
          <li>采用敏捷开发，快速迭代验证</li>
          <li>深入用户调研，精准定位需求</li>
          <li>多渠道推广，控制获客成本</li>
        </ul>
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 操作按钮 */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回编辑
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopyText}>
              <Copy className="w-5 h-5 mr-2" />
              复制文本
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('html')}
              disabled={isExporting}
            >
              <Download className="w-5 h-5 mr-2" />
              导出HTML
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <FileText className="w-5 h-5 mr-2" />
              导出PDF
            </Button>

            <Button onClick={() => router.push('/export')}>
              导出报告
            </Button>
          </div>
        </div>

        {/* 文档预览 */}
        <Card className="bg-white shadow-lg">
          <div className="p-8">
            {/* 文档标题 */}
            <div className="text-center mb-12 pb-8 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {projectData.name}
              </h1>
              <p className="text-xl text-gray-600 mb-2">商业计划书</p>
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <span>项目类型: {projectData.type === 'mini-program' ? '小程序' : projectData.type === 'app' ? 'APP' : '跨端应用'}</span>
                <span>生成时间: {new Date().toLocaleDateString('zh-CN')}</span>
              </div>
            </div>

            {/* 文档内容 */}
            <div className="prose prose-lg max-w-none">
              {reportSections.map((section, index) => (
                <div key={index} className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {section.title}
                  </h2>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>

            {/* 页脚 */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>本报告由AI商业计划书生成器自动生成</p>
              <p>建议结合实际情况进行调整完善</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}