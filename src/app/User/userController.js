const {response, errResponse} = require('../../../config/response')
const baseResponse = require('../../../config/baseResponseStatus')
const userProvider = require('./userProvider')
const userService = require('./userService')
const userDao = require('./userDao')
const baseResponseStatus = require('../../../config/baseResponseStatus')

// const regexEmail = require('')

exports.postUser = async(req, res) =>{
    const {username, email, password } = req.body

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    const signUpResponse = await userService.createUser(username, email, password)
    return res.send(signUpResponse)
}

exports.getUsers = async(req, res) => {
    const userList = await userProvider.getUsers()
    return res.send(response(baseResponseStatus.SUCCESS, userList))
}