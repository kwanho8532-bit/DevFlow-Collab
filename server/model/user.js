import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: 'https://images.unsplash.com/photo-1413847394921-b259543f4872?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },

})

userSchema.plugin(passportLocalMongoose.default, {
    usernameField: 'email'
})

export default mongoose.model('User', userSchema)