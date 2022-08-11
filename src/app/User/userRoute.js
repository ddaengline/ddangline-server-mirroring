const jwtMiddleware = require("../../../config/jwtMiddleware");
const user = require("./userController");
module.exports = function(app){
  const user = require('./userController')
  const jwtMiddleware = require('../../../config/jwtMiddleware')

  // 회원가입
  app.post(`/app/v1/users`, user.postUser)
  // test
  app.get(`/admin/v1/users`, user.getUsers)
  // 로그인
  app.post('/app/v1/users/login', user.login)

  app.get('/app/v1/users/:userId', jwtMiddleware, user.getUser)
  // 유저 이름 변경
  app.patch('/app/v1/users/:userId/username', jwtMiddleware, user.updateUserName)
  // 비밀번호 변경
  app.patch('/app/v1/users/:userId/password', jwtMiddleware, user.updateUserPassword)
  // TODO: 회원 탈퇴, 회원 탈퇴 정보 90일 유지 기능
  app.delete('/app/v1/users/:userId/status', jwtMiddleware, user.deleteUser)
}