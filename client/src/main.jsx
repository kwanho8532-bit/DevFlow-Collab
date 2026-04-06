import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react"; // GlitchTip은 Sentry SDK를 사용합니다.

Sentry.init({
  dsn: import.meta.env.VITE_GLITCHTIP_DSN,

  // GlitchTip 공식 문서 권장사항
  autoSessionTracking: false, // GlitchTip does not support sessions

  // 1. 환경 구분(필수)
  // 대시보드에서 '로컬 에러'와 '실제 서비스 에러'를 필터링할 수 있게 해줍니다.
  environment: import.meta.env.PROD ? "production" : "development",

  // 2. 릴리즈 버전 관리
  // 어떤 버전의 코드에서 에러가 났는지 추적합니다. (package.json의 버전을 활용하면 좋습니다.)
  release: "devflow-frontend@1.0.0",

  // 3. 성능 모니터링 샘플링 비율
  // 1.0은 모든 트랜잭션을 수집합니다. 서비스 규모가 커지면 0.1(10%) 정도로 낮춰서 부하를 줄입니다.
  tracesSampleRate: 1.0,

  // 4. 민감 정보 제외 (보안)
  // 사용자의 비밀번호나 개인정보가 포함된 에러 로그가 서버로 전송되는 것을 방지합니다.
  beforeSend(event) {
    if (event.request && event.request.url.includes("signin")) {
      delete event.request.data; // 로그인 관련 데이터는 전송하지 않음
    }
    return event;
  },

  // 오직 실제 배포된 사이트(Production)에서만 GlitchTip을 작동시키겠다는 의미
  enabled: import.meta.env.PROD
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
