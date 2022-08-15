const { Collection } = require('../../models/Collection')
const { User } = require('../../models/User')

async function createCollection(userId, name){
  const collection = new Collection({ name, userId })
  return collection.save()
}

// 특정 수납장 > 특정 가게 추가
// TODO: placeId 순서 배치는 어떻게 할 것인가?
async function pushPlaceToCollection(collectionId, placeId){
  return Collection.updateOne({ _id: collectionId }, { $push: { places: placeId }, $inc: { total: 1 } })
}

async function updateCollectionName(collectionId, name){
  return Collection.findByIdAndUpdate(collectionId, { $set: { name: name } }, { new: true })
}

async function updateCollectionOrder(collectionId, order){
  return Collection.findByIdAndUpdate(collectionId, { $inc: { order } }, { new: true })
}

async function getCollections(userId){
  return Collection.find({ userId }, { _id: 1, name: 1, total: 1, order: 1 }).sort({ order: 1 })
}

async function getCollectionsLastOrder(userId){
  return Collection.findOne({ userId }, {order : 1}).sort({ order: -1 }).limit(1)
}

async function getUserName(userId){
  return User.findById(userId, { username: 1, _id: 0 })
}

async function getCollection(collectionId){
  return Collection.findById(collectionId, { _id: 1, name: 1, total: 1, places: 1 })
}

async function getPlaceInCollection(collectionId, placeId){
  return Collection.findOne({ _id: collectionId, places: placeId })
}

async function deletePlaceInCollection(collectionId, placeId){
  return Collection.updateOne({ _id: collectionId }, { $pull: { places: placeId }, $inc: { total: -1 } })
}

async function deleteCollection(collectionId){
  return Collection.findByIdAndDelete(collectionId)
}

module.exports = {
  createCollection,
  getCollections, getCollectionsLastOrder,
  getUserName,
  getCollection,
  pushPlaceToCollection,
  updateCollectionName, updateCollectionOrder,
  getPlaceInCollection,
  deletePlaceInCollection, deleteCollection
}