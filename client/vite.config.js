import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from "@sentry/vite-plugin";
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // ✅ 빌드 시 소스 맵을 GlitchTip으로 자동 업로드
    sentryVitePlugin({
      org: "prime",       // GlitchTip 조직 슬러그
      project: "devflow-frontend",   // 프로젝트 이름
      authToken: process.env.SENTRY_AUTH_TOKEN, // 1단계에서 만든 토큰
      url: "https://app.glitchtip.com/"
    }),
    Sitemap({
      hostname: 'https://dev-flow-collab.duckdns.org',
      outDir: resolve(__dirname, 'dist')
    }), // 실제 배포된 주소 입력

  ],
  build: {
    sourcemap: true, // ✅ 필수: 빌드 시 .map 파일을 생성하도록 설정
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
