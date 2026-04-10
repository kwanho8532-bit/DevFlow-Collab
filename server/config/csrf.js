import { doubleCsrf } from "csrf-csrf";

const {
    generateCsrfToken,
    invalidCsrfTokenError,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => process.env.CSRF_TOKEN_SECRET,
    cookieName: '__Secure-x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    },
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token']
})

export default { generateCsrfToken, invalidCsrfTokenError, doubleCsrfProtection }