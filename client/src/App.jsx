import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './component/landing/LandingPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
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
import { Analytics } from '@vercel/analytics/react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 불러오기

dayjs.locale('ko'); // 전역적으로 한국어 설정 적용

function App() {
  const { open, message, severity, clearSnackbar } = useSnackbarStore()

  return (
    <>
      <CssBaseline />
      <Analytics />

      <BrowserRouter>
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
    </>
  )
}

export default App
