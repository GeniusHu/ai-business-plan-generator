# 环境配置指南

## API密钥配置

本项目使用豆包AI服务来生成商业计划。为了正常使用AI功能，你需要配置API密钥。

### 步骤1：复制环境变量文件

```bash
cp .env.example .env.local
```

### 步骤2：编辑环境变量

编辑 `.env.local` 文件，填入你的豆包API密钥：

```env
# AI Service Configuration
DOUBAO_API_KEY=dff0bc35-0b2b-4860-afe5-ccb5e7c2387b
DOUBAO_MODEL=doubao-1-5-pro-256k-250115
DOUBAO_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
```

### 步骤3：重启开发服务器

配置完成后，重启Next.js开发服务器：

```bash
npm run dev
```

## 备用方案

如果API密钥未配置或AI服务不可用，系统会自动切换到基于规则的备用方案，确保应用仍然可以正常工作。

## 安全提醒

- ⚠️ **永远不要**将 `.env.local` 文件提交到版本控制系统
- ⚠️ **永远不要**在代码中硬编码API密钥
- ✅ `.env.local` 文件已在 `.gitignore` 中被排除
- ✅ 可以安全地分享 `.env.example` 文件，它不包含真实密钥

## 部署注意事项

在部署到生产环境时，请确保：

1. Vercel: 在项目设置中添加 Environment Variables
2. 其他平台: 按照平台文档配置环境变量
3. 确保API密钥有足够的调用配额