'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>({});

  useEffect(() => {
    // 客户端无法直接访问环境变量，我们在服务器端获取
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/debug/env');
        const data = await response.json();
        setEnvStatus(data);
      } catch (error) {
        setEnvStatus({ error: '无法获取环境变量状态' });
      }
    };

    checkEnv();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 调试面板</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">环境变量状态</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(envStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API测试</h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/debug/test-ai');
                const result = await response.json();
                alert(JSON.stringify(result, null, 2));
              } catch (error) {
                alert('测试失败: ' + error);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            测试AI API
          </button>
        </div>
      </div>
    </div>
  );
}