const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const mailService = require('./mailService');

exports.sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  const emailSend = await mailService.sendCode(email);
  return res.send(emailSend);
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (!code) return res.send(errResponse(baseResponse.AUTH_MAIL_EMPTY));
  const emailValidation = await mailService.verifyCode(email, code);
  return res.send(emailValidation);
};
