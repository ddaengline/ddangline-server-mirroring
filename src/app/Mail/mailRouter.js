module.exports = function (app) {
  const mail = require('./mailController');

  // 인증 코드 전송
  app.post('/app/v1/email/code', mail.sendCode);

  // 인증 코드 점검
  app.post('/app/v1/email/code/auth', mail.verifyCode);

  // 이메일 중복
  app.post('/app/v1/email', mail.checkEmailDuplication);
};
