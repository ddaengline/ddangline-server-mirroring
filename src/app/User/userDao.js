const { User } = require('../../models/User');

// 유저 생성
async function createUser(insertUserInfoParams) {
  const user = new User(insertUserInfoParams);
  const re = await user.save();
  return re;
}

async function getUsers() {
  return await User.find({}, { _id: 1, username: 1, email: 1 });
}

async function getUserByEmail(email) {
    // null, Object
  return await User.findOne({ email });
}

async function emailCheck(inputEmail) {
  const result = await User.findOne({ email: inputEmail });
  return result ? true : false;
}

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  emailCheck,
};
