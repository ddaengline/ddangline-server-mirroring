const jwtMiddleware = require("../../../config/jwtMiddleware");
const user = require("./userController");
module.exports = function(app){
  const user = require('./userController')
  const jwtMiddleware = require('../../../config/jwtMiddleware')

  // 회원가입
  // TODO: 카카오 로그인 추가
  app.post(`/app/v1/users`, user.postUser)
  // test
  app.get(`/admin/v1/users`, user.getUsers)
  // 로그인
  app.post('/app/v1/users/login', user.login)
  // TODO: 특정 유저 정보
  app.get('/app/v1/users/:userId', jwtMiddleware, user.getUser)
  // TODO: 사용자 이름 변경
  app.patch('/app/v1/users/:userId/username', jwtMiddleware, user.updateUserName)
  // TODO: 비밀번호 변경
  // app.patch('/app/v1/users/:userId/password', jwtMiddleware, user.updateUserPassword)
  // TODO: 회원 탈퇴
  // app.patch('/app/v1/users/:userId/status', jwtMiddleware, user.updateUserStatus)
}