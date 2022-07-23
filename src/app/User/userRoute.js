module.exports = function(app){
    const user = require('./userController')
    const jwtMiddleware = require('../../../config/jwtMiddleware')

    // 회원가입
    app.post(`/app/v1/users`, user.postUser)
    // test
    app.get(`/app/v1/users`, user.getUsers)

    // 로그인
    app.post('/app/v1/users/login', user.login)
}