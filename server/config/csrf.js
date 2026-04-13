import { doubleCsrf } from "csrf-csrf";

const {
    generateCsrfToken,
    invalidCsrfTokenError,
    doubleCsrfProtection
} = doubleCsrf({
    getSessionIdentifier: (req) => req.sessionID,
    getSecret: () => process.env.CSRF_TOKEN_SECRET,
    cookieName: '__Secure-x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    },
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token']
})

// 명시적으로 값이 존재하는지 확인
if (!generateCsrfToken) {
    console.error("FAILED: generateCsrfToken is undefined!");
}

export { generateCsrfToken, invalidCsrfTokenError, doubleCsrfProtection }