module.exports = function(app){
  const user = require('./userController')
  const jwtMiddleware = require('../../../config/jwtMiddleware')
  const AppleMiddleware = require('../../../config/AppleMiddleware')

  // 임시 유저 회원가입
  // TODO: 임시유저 -> 로그인했을 때 로직 처리
  app.get('/app/v1/users/default', user.postDefaultUser)
  // 회원가입
  app.post(`/app/v1/users`, user.postUser)
  // test
  app.get(`/admin/v1/users`, user.getUsers)
  // 로그인
  app.post('/app/v1/users/login', user.login)
  // 유저 정보
  app.get('/app/v1/users/setting', jwtMiddleware, user.getUser)
  // 유저 이름 변경
  app.patch('/app/v1/users/username', jwtMiddleware, user.updateUserName)
  // 비밀번호 변경
  app.patch('/app/v1/users/password', jwtMiddleware, user.updateUserPassword)
  // TODO: 회원 탈퇴, 회원 탈퇴 정보 90일 유지 기능, 애플 로그인 회원 탈퇴
  app.patch('/app/v1/users/status', AppleMiddleware, jwtMiddleware, user.deleteUser)
}