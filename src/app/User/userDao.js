const { User } = require('../../models/User')

// 유저 생성
async function createUser(connection, insertUserInfoParams){
    const user = new User(insertUserInfoParams)
    const re = await user.save();
    return re
}

async function getUsers(){
    return await User.find({}, {_id : 1, username : 1, email : 1})
}

module.exports = {
    createUser,
    getUsers,
}