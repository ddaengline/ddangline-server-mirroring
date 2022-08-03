const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { MailAuthentication } = require('../../models/MailAuthentication');
const { User } = require('../../models/User');
const { response, errResponse } = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const nodemail = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);
require('dotenv').config();

// 이메일 중복 검사
exports.checkEmailDuplication = async (email) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const emailUser = await User.findOne({ email });
    if (emailUser) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
    connection.disconnect();
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: '중복된 이메일이 없습니다.' });
  } catch (error) {
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 인증 코드 전송
exports.sendCode = async (mailToSend) => {
  try {
    let authCode = Math.random().toString(10).substr(2, 4);
    const params = { email: mailToSend, code: authCode };
    const { MAIL_HOST, MAIL_SERVICE, MAIL_SENDER, MAIL_PASSWORD } = process.env;
    const emailTemplate = await ejs.renderFile(appDir + '/src/template/authMail.ejs', { authCode });

    const transporter = nodemail.createTransport({
      service: MAIL_SERVICE,
      host: MAIL_HOST,
      secure: true,
      auth: {
        user: MAIL_SENDER,
        pass: MAIL_PASSWORD,
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
    let mailObject = await MailAuthentication.findOneAndDelete({ email: mailToSend });
    mailObject = new MailAuthentication(params);

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
    if (!mailObject) return errResponse(baseResponse.AUTH_MAIL_WRONG); // 3분 만료 후에도.
    else if (mailObject.code !== validationCode) return errResponse(baseResponse.AUTH_CODE_WRONG);
    connection.disconnect();
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: '이메일 인증 성공' });
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponse.DB_ERROR);
  }
};
