const { response, errResponse } = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const userProvider = require('./userProvider');
const userService = require('./userService');
const userDao = require('./userDao');
const baseResponseStatus = require('../../../config/baseResponseStatus');

// const regexEmail = require('')

exports.postUser = async(req, res) => {
  const { username, email, uniqueId, password } = req.body;
  let postParams = {}

  if(email)
    if (email.length > 30) return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH))
    else postParams['email'] = email
  if(username) postParams['username'] = email
  if(uniqueId) postParams['uniqueId'] = uniqueId
  if (password) postParams['password'] = password

  const signUpResponse = await userService.createUser(postParams);
  return res.send(signUpResponse);
};

exports.getUsers = async(req, res) => {
  const userList = await userProvider.getUsers();
  return res.send(response(baseResponseStatus.SUCCESS, userList));
};

exports.login = async(req, res) => {
  const { email, password } = req.body;
  if (!email) return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (!password) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));

  const signInRes = await userService.postSignIn(email, password);
  return res.send(signInRes);
};
