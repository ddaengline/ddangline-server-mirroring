const { User } = require('../../models/User');

// 유저 생성
async function createUser(insertUserInfoParams){
  const user = new User(insertUserInfoParams);
  const re = await user.save();
  return re;
}

async function getUsers(){
  return User.find({}, { _id: 1, username: 1, email: 1 });
}

async function getUser(id){
  return User.findById(id, { _id: 1, username: 1, email: 1 })
}

async function updateUserName(id, name){
  return User.findOneAndUpdate({ _id: id }, { username: name }, {
    runValidators: true,
    new: true,
    projection: { _id: 1, username: 1 }
  })
}

async function updateUserPassword(id, pw){
  return User.findOneAndUpdate({ _id: id }, { password: pw }, {
    runValidators: true,
    new: true,
    projection: { _id: 1 }
  })
}

async function deleteUser(id){
  return User.findByIdAndDelete({ _id: id }, { status: 'WITHDRAWAL' }, {
    runValidators: true,
    new: true,
    projection: { _id: 1 }
  })
}

async function getUserByEmail(email){
  // null, Object
  return User.findOne({ email });
}

async function emailCheck(inputEmail){
  const result = await User.findOne({ email: inputEmail });
  return result ? true : false;
}

async function getPassword(id, pw){
  return User.findById(id, { password: 1 })
}

async function socialIdCheck(id){
  const result = await User.findOne({ 'social.uniqueId': id })
  return result ? true : false;
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUserName,
  updateUserPassword,
  deleteUser,
  getUserByEmail,
  getPassword,
  emailCheck,
  socialIdCheck,
};
