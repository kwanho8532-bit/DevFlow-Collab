import passport from "passport";
import User from '../model/user.js';

const configurePassport = (passport) => {
    passport.use(User.createStrategy())
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
                .select('username email profileImg')
                .lean()
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
}

export default configurePassport