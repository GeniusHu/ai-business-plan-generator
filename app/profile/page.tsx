'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { Plus, Download, Eye, Trash2, Settings, Crown, FolderOpen } from 'lucide-react';
import { ProjectData } from '@/types';

export default function ProfilePage() {
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const router = useRouter();
  const { state, dispatch } = useProject();

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = () => {
    // 从localStorage加载所有保存的项目
    const projects: ProjectData[] = [];

    // 遍历localStorage查找所有项目数据
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('project_')) {
        try {
          const projectData = JSON.parse(localStorage.getItem(key) || '{}');
          projects.push(projectData);
        } catch (error) {
          console.error('Failed to load project:', key, error);
        }
      }
    }

    // 如果有当前项目且不在列表中，也加入
    if (state.projectData) {
      const currentProjectId = `project_${state.projectData.id}`;
      const exists = projects.find(p => p.id === state.projectData?.id);
      if (!exists) {
        projects.push(state.projectData);
      }
    }

    // 按创建时间倒序排列
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setSavedProjects(projects);
  };

  const handleNewProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
    router.push('/');
  };

  const handleOpenProject = (projectId: string) => {
    dispatch({ type: 'LOAD_PROJECT', payload: projectId });
    router.push('/canvas');
  };

  const handleDeleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡

    if (confirm('确定要删除这个项目吗？此操作不可恢复。')) {
      // 从localStorage删除项目
      localStorage.removeItem(`project_${projectId}`);

      // 如果删除的是当前项目，重置状态
      if (state.projectData?.id === projectId) {
        dispatch({ type: 'RESET_PROJECT' });
      }

      // 重新加载项目列表
      loadSavedProjects();
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'mini-program':
        return '小程序';
      case 'app':
        return 'APP';
      case 'cross-platform':
        return '跨端';
      default:
        return type;
    }
  };

  const getIndustryIcon = (industry: string) => {
    // 简单的行业图标映射
    const iconMap: { [key: string]: string } = {
      'ecommerce': '🛒',
      'tools': 'tools',
      'content': 'mobile',
      'social': '👥',
      'local-life': '🏪',
      'education': '📚',
      'health': '🏥',
      'ai-tools': 'ai',
      'enterprise': '💼'
    };
    return iconMap[industry] || '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              我的项目
            </h1>
            <p className="text-gray-600">
              管理你的商业计划书项目，查看历史记录
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleNewProject}>
              <Plus className="w-5 h-5 mr-2" />
              新建项目
            </Button>
          </div>
        </div>

        {/* 当前项目卡片 */}
        {state.projectData && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4">
                    AI
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">当前项目</h3>
                    <p className="text-blue-700">{state.projectData.name}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/canvas')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    查看画布
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/preview')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    导出
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">项目类型:</span>
                  <div className="text-blue-900">
                    {getProjectTypeLabel(state.projectData.type)}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">所属行业:</span>
                  <div className="text-blue-900">
                    {getIndustryIcon(state.projectData.industry)} {state.projectData.industry}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">创建时间:</span>
                  <div className="text-blue-900">
                    {formatDate(state.projectData.createdAt)}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">项目状态:</span>
                  <div className="text-blue-900">
                    {state.projectData.status === 'completed' ? '已完成' : '草稿'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 历史项目列表 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-gray-600" />
            历史项目
          </h2>
        </div>

        {savedProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => (
              <div
                key={project.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-md hover:border-gray-300"
                onClick={() => handleOpenProject(project.id)}
              >
                <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">
                          {getIndustryIcon(project.industry)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {getProjectTypeLabel(project.type)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.questions.productDescription || '未填写产品描述'}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>创建时间: {formatDate(project.createdAt)}</div>
                    <div>更新时间: {formatDate(project.updatedAt)}</div>
                    <div className="flex items-center">
                      状态:
                      <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status === 'completed' ? '已完成' : '草稿'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 加载项目并跳转到导出页
                        dispatch({ type: 'LOAD_PROJECT', payload: project.id });
                        router.push('/export');
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      导出
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无项目
              </h3>
              <p className="text-gray-600 mb-4">
                创建你的第一个AI商业计划书项目吧！
              </p>
              <Button onClick={handleNewProject}>
                <Plus className="w-5 h-5 mr-2" />
                创建项目
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 专业版升级入口 */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-purple-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    升级到专业版
                  </h3>
                  <p className="text-gray-600 text-sm">
                    解锁更多高级功能：竞品分析、PRD生成、UI原型等
                  </p>
                </div>
              </div>

              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                了解更多
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}