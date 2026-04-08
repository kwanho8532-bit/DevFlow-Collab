import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import signRouter from './routes/sign.js'
import globalRouter from './routes/global.js'
import projectRouter from './routes/project.js'
import taskRouter from './routes/task.js'
import workspaceRouter from './routes/workspace.js'
import searchRouter from './routes/search.js'
import inviteRouter from './routes/invite.js'
import chatRouter from './routes/chat.js'

import configurePassport from './config/passport.js'
import * as Sentry from '@sentry/node'; // ✅ ESM 방식으로 불러오기

// 1. Sentry 초기화 (모든 코드의 최상단)
Sentry.init({
    dsn: process.env.GLITCHTIP_DSN,
    // ⚠️ v8에서는 requestHandler를 명시적으로 
    // app.use(Sentry.Handlers.requestHandler());
    // app.use(Sentry.Handlers.tracingHandler());
    // 할 필요가 없는 경우가 많습니다.
    // 대신 SDK가 자동으로 HTTP 요청을 추적합니다.
    autoSessionTracking: false,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV === 'production' ? "production" : "development",
    release: "devflow-backend@1.0.0",
    beforeSend(event) {
        if (event.request && event.request.url.includes("signin")) {
            delete event.request.data; // 로그인 관련 데이터는 전송하지 않음
        }
        return event;
    },
    enabled: process.env.NODE_ENV === 'production'
});

const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL);

const db = mongoose.connection

db.on('error', (err) => {
    console.error("연결 에러 발생:", err);
});

db.once('open', () => {
    console.log("MongoDB 연결 성공!");
});

const app = express()

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            // Cloudinary 이미지 호스트를 명시적으로 허용
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
            // 만약 Cloudinary에서 제공하는 JS 라이브러리를 쓴다면 추가
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"], // MUI 쓰면 거의 필요
        }
    }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('trust proxy', 1)

const sessionConfig = {
    name: 'DevFlow.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    // rolling: true는 사용자가 서버에 요청을 보낼 때마다 세션 만료시간이 새로고침됨
    // 기본값은 false지만 명시적으로 false를 해줌 
    // 이후 axios.interceptors와 zustand(useAuthStore), interval로 getAuth요청을 보내는 방식으로
    // 세션이 만료되면 signin으로 튕기도록 만들었음
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: 'sessions',
        ttl: 60 * 60 * 3 // 초단위 (보통 maxAge와 값 맞춤)
        // maxAge는 브라우저 기준으로 쿠키가 언제 삭제될지를 지정
        // ttl은 DB기준으로 세션 문서가 언제 삭제될지를 지정

        // ⚠️ 둘이 다르면 어떻게 되냐?
        // 상황	                    결과
        // cookie 만료, ttl 남음	DB에 세션은 남아있지만 접근 불가
        // ttl 만료, cookie 남음	쿠키는 있지만 세션 없음 → 로그아웃
        // 둘 다 같음	            👍 가장 이상적
    }),
    cookie: {
        // 개발 환경
        // httpOnly: false,
        // secure: false,

        // 프로덕트 환경
        httpOnly: true,
        sameSite: 'none', // 서로 다른 도메인(Vercel <-> Render) 간 쿠키 전송 허용
        secure: true,
        maxAge: 1000 * 60 * 60 * 3
    }
}

const allowedOrigins = [
    'https://dev-flow-collab.duckdns.org', // 배포 시 vercel 주소
    'http://localhost:5173' // 로컬 테스트용
]

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())

configurePassport(passport)

app.use('/api', signRouter)

app.use('/api/me', globalRouter)

app.use('/api/project', projectRouter)

app.use('/api/project/:projectId', taskRouter)

app.use('/api/project/:projectId/task', taskRouter)

app.use('/api/task/:taskId', taskRouter)

app.use('/api/workspace', workspaceRouter)

app.use('/api/invite', workspaceRouter)

app.use('/api', searchRouter)

app.use('/api', inviteRouter)

app.use('/api/chat', chatRouter)

// 위의 archive/ unarchive는 project라우터에 넣고,
// 아래의 task관련은 project에 속해있긴 하지만
// 그 자체로 많은 데이터를 가진 별개의 주체로 보고
// task라우터로 분리해서 정리하기

// 3. Sentry 에러 핸들러 (Error Handler)
// 반드시 모든 라우터보다 '뒤에' 위치해야 합니다.
Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
    // console.log(err, '147')
    // console.log(err.message, 'message')
    console.log(err.stack, 'stack')
    // console.log(err.status, 'status')

    const status = err.status || 500
    const message = err.message || '에러 미들웨어에서 처리된 에러'

    return res.status(status).json({ message, })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on the ${port} port!`)
})