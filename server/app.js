import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'

import signRouter from './routes/sign.js'
import globalRouter from './routes/global.js'
import projectRouter from './routes/project.js'
import taskRouter from './routes/task.js'
import workspaceRouter from './routes/workspace.js'
import searchRouter from './routes/search.js'
import inviteRouter from './routes/invite.js'
import chatRouter from './routes/chat.js'

import configurePassport from './config/passport.js'

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}

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

// app.use('/api/messages', chatRouter)


// 위의 archive/ unarchive는 project라우터에 넣고,
// 아래의 task관련은 project에 속해있긴 하지만
// 그 자체로 많은 데이터를 가진 별개의 주체로 보고
// task라우터로 분리해서 정리하기

app.use((err, req, res, next) => {
    // console.log(err, '147')
    // console.log(err.message, 'message')
    console.log(err.stack, 'stack')
    // console.log(err.status, 'status')

    const status = err.status || 500
    const message = err.message || '에러 미들웨어에서 처리된 에러'

    return res.status(status).json({ message, })
})

app.listen(3000, () => {
    console.log('Listening on the 3000 port!')
})