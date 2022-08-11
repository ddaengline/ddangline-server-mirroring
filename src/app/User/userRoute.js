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

  // TODO: 사용자 이름 변경

  // TODO: 비밀번호 변경

  // TODO: 회원 탈퇴

}