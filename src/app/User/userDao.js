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

async function getUserByEmail(email){
  // null, Object
  return User.findOne({ email });
}

async function emailCheck(inputEmail){
  const result = await User.findOne({ email: inputEmail });
  return result ? true : false;
}

async function socialIdCheck(id){
  const result = await User.findOne({ 'social.uniqueId': id })
  return result ? true : false;
}

module.exports = {
  createUser, getUsers, getUser, updateUserName, getUserByEmail, emailCheck, socialIdCheck,
};
