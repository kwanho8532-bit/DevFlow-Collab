// import.meta.env.PROD는 현재 앱이 실행 중인 환경이
// '배포용(Production)'인지 아닌지를 나타내는 불리언(Boolean) 값을 가지고 있습니다.
// 즉 아래의 코드는 process.env.NODE_ENV === "production" 이 코드와 동일함
if (import.meta.env.PROD) {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './component/landing/LandingPage.jsx'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Signup from './component/sign/Signup.jsx';
import Signin from './component/sign/Signin.jsx';
import ContextLayout from './component/wrap/ContextLayout.jsx'
import Hub from './component/hub/Hub.jsx';
import DashBoardPage from './component/dashboard/DashBoardPage.jsx'
import ProjectDetail from './component/dashboard/ProjectDetail/ProjectDetail.jsx';
import ProtectedRoute from './component/wrap/ProtectedRoute.jsx';
import Spinner from './component/etc/Spinner.jsx';
import KanbanPage from './component/dashboard/kanban/KanbanPage.jsx';
import ArchivedPage from './component/dashboard/archivePage/ArchivedPage.jsx';
import WorkspacePage from './component/workspace/WorkspacePage.jsx';
import WorkspaceArchivePage from './component/workspace/main/archive/WorkspaceArchivePage.jsx';
import MainBoard from './component/workspace/main/board/MainBoard.jsx';
import Board from './component/workspace/main/board/Board.jsx';
import InviteBox from './component/workspace/main/invite-box/InviteBox.jsx';
import { Alert, Snackbar } from '@mui/material';
import { useSnackbarStore } from './store/useSnackbarStore.js';
import MessagePage from './component/messages/MessagePage.jsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 불러오기
import ReactGA from "react-ga4";
import { useEffect } from 'react';
import * as Sentry from "@sentry/react";

dayjs.locale('ko'); // 전역적으로 한국어 설정 적용

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 현재 경로를 GA4로 전송합니다.
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search
    });
  }, [location]);

  return null;
};

function App() {
  const { open, message, severity, clearSnackbar } = useSnackbarStore()

  return (
    <>
      <Sentry.ErrorBoundary
        fallback={
          <div style={{ padding: '20px' }}>
            <h2>알 수 없는 오류가 발생했습니다.</h2>
            <p>페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
          </div>
        }>
        <CssBaseline />

        <BrowserRouter>
          <RouteTracker />
          <Spinner content='Loading' />
          <Routes>
            <Route element={<ContextLayout />}>
              <Route element={<LandingPage />} path='/landing' />
              <Route element={<Signin />} path='/signin' />
              <Route element={<Signup />} path='/signup' />
              <Route element={<Hub />} path='/hub' />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashBoardPage />}>
                  <Route element={<KanbanPage />} path='/dashboard' />
                  <Route element={<ArchivedPage />} path='/archived' />
                </Route>
                <Route element={<ProjectDetail />} path='/project/:id' />

                <Route element={<WorkspacePage />} path='/workspace/:id'>
                  <Route element={<MainBoard />}>
                    <Route index element={<Board />} />
                    {/* 부모가 이미 /workspace/:id 이기 때문에 /workspace/:id/archive 대신 archive만 작성해도 됨 */}
                    <Route element={<WorkspaceArchivePage />} path='/workspace/:id/archive' />
                  </Route>
                </Route>

                <Route element={<MessagePage />} path='/messages' />

                <Route element={<InviteBox />} path='/invite-box' />


              </Route>
            </Route>
          </Routes>

          {/* ✅ 전역 스낵바 설정 */}
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={clearSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={clearSnackbar}
              severity={severity}
            >
              {message}
            </Alert>
          </Snackbar>

        </BrowserRouter>
      </Sentry.ErrorBoundary >
    </>
  )
}

export default App
