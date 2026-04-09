import rateLimit from 'express-rate-limit'

// router/sign.js에서 사용
export const postLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5분
    limit: 5,
    keyGenerator: (req, res) => {
        return req.body.email || req.ip // body가 없는 요청의 경우에는 ip로 판단
    },
    handler: (req, res, next, options) => {
        // 1. 헤더에 차단 기간(초) 설정 (5분 = 300초)
        const retryAfterSeconds = Math.ceil(options.windowMs / 1000);
        res.set('Retry-After', String(retryAfterSeconds));

        // 2. 응답 바디에도 포함해주면 클라이언트가 파싱하기 더 편함
        res.status(429).json({
            status: 429,
            message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.',
            retryAfter: retryAfterSeconds // 300
        });
    }
});