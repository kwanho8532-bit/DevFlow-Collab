import User from "../model/user.js"


export const findUsersByQuery = async (q, myId) => {
    const users = await User.find({
        username: q,
        _id: { $ne: myId }
    })
    return users
}