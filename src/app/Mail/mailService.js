const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { MailAuthentication } = require('../../models/MailAuthentication');
const { response, errResponse } = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const nodemail = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);
require('dotenv').config();

// 인증 코드 전송
exports.sendCode = async (mailToSend) => {
  try {
    let authCode = Math.random().toString(36).substr(2, 11);
    const { OAUTH_USER, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN, OAUTH_MAIL_SERVICE, OAUTH_MAIL_HOST, OAUTH_MAIL_PORT } =
      process.env;

    let emailTemplate;
    ejs.renderFile(appDir + '/src/template/authMail.ejs', { authCode }, (error, data) => {
      if (error) return errResponse(baseResponse.DB_ERROR);
      emailTemplate = data;
    });

    const params = { email: mailToSend, code: authCode };

    const transporter = nodemail.createTransport({
      service: OAUTH_MAIL_SERVICE,
      host: OAUTH_MAIL_HOST,
      port: OAUTH_MAIL_PORT,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: OAUTH_USER,
        clientId: OAUTH_CLIENT_ID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOption = {
      from: `땡호선 no-reply@ddangline.shop`, // sender address
      to: mailToSend, // list of receivers
      subject: '[땡호선] 인증번호를 안내해드립니다.', // Subject line
      text: '땡호선 인증번호 전송', // plain text body
      html: emailTemplate,
    };

    const connection = await mongoose.connect(MONGO_URI, { dbName });
    let mailObject = await MailAuthentication.findOne({ email: mailToSend });
    if (!mailObject) mailObject = new MailAuthentication(params);
    else mailObject.code = authCode;

    await Promise.all([transporter.sendMail(mailOption), mailObject.save()]);
    Promise.all([connection.disconnect(), transporter.close()]);
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: '인증 코드 전송 성공' });
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 인증 코드 validation
exports.verifyCode = async (email, validationCode) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const mailObject = await MailAuthentication.findOne({ email });
    if (!mailObject) return errResponse(baseResponse.AUTH_MAIL_EMPTY);
    if (mailObject.code !== validationCode) return errResponse(baseResponse.AUTH_MAIL_WRONG);
    connection.disconnect();
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: '이메일 인증 성공' });
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponse.DB_ERROR);
  }
};
