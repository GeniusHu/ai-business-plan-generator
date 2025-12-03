import type { Metadata } from "next";
import "./globals.css";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "AI商业计划书生成器 | 智能创业助手",
  description: "5分钟生成专业级小程序/APP商业计划书，AI驱动的智能创业助手，助力创业者快速完成商业规划",
  keywords: "商业计划书, AI生成, 创业, 小程序, APP, 商业规划, 投资融资",
  authors: [{ name: "AI商业计划书团队" }],
  openGraph: {
    title: "AI商业计划书生成器",
    description: "一句话生成专业级商业计划书，让创业更简单",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI商业计划书生成器",
    description: "5分钟生成专业级商业计划书",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
