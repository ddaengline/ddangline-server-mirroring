const { User } = require('../../models/User');
const { Collection } = require('../../models/Collection')
const { Place } = require('../../models/Place')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

// 유저 생성
async function createUser(insertUserInfoParams){
  const user = new User(insertUserInfoParams);
  return user.save();
}

async function getUsers(){
  return User.find({}, { _id: 1, username: 1, email: 1 });
}

async function getUser(_id){
  return User.findOne({ _id, status: "ACTIVE" }, { _id: 1, username: 1, email: 1 })
}

async function updateUserName(_id, name){
  return User.findOneAndUpdate({ _id, status: "ACTIVE" }, { username: name }, {
    runValidators: true,
    new: true,
    projection: { _id: 1, username: 1 }
  })
}

async function updateUserPassword(id, pw){
  return User.findOneAndUpdate({ _id: id, status: "ACTIVE" }, { password: pw }, {
    runValidators: true,
    new: true,
    projection: { _id: 1 }
  })
}

async function deleteUser(id){
  // TODO: 유저 상태 변경'WITHDRAWAL', 유저 수납장 삭제, 가게 좋아요/싫어요/갔다옴 pull
  // TODO : 가게 추천/저장/갔다옴 totalNumber
  return Promise.all([User.findOneAndUpdate({ _id: id }, { status: 'WITHDRAWAL' }),
    Collection.deleteMany({ userId: id }),
    Place.updateMany({ liked: id }, { $pull: { liked: id }, $inc: { totalLiked: -1 } }),
    Place.updateMany({ marked: id }, { $pull: { marked: id }, $inc: { totalMarked: -1 } }),
    Place.updateMany({ visited: id }, { $pull: { visited: id }, $inc: { totalVisited: -1 } }),
  ])
}

async function getUserByEmail(email){
  // null, Object
  return User.findOne({ email: email, status: "ACTIVE" });
}

async function emailCheck(inputEmail){
  const result = await User.findOne({ email: inputEmail, status: "ACTIVE" });
  return result ? true : false;
}

async function getPassword(_id){
  return User.findOne({ _id, status: "ACTIVE" }, { password: 1 })
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
