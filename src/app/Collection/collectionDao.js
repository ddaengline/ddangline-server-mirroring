const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { Collection } = require('../../models/Collection')
const { User } = require('../../models/User')

async function createCollection(userId, name){
  switch (arguments.length) {
    case 1: // default
      return Collection.insertMany([{ userId, name: "liked", type: "LIKED" }, { userId, name: "marked", type: "MARKED" }, { userId, name: "visited", type: "VISITED" }])
    case 2:
      const collection = new Collection({ name, userId })
      return collection.save()
  }
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
  return Collection.find({ userId }, { _id: 1, name: 1, type: 1, total: 1, order: 1 }).sort({ order: 1 })
}

async function getCollection(userId, collectionId){
  return Collection.aggregate()
    .match({ _id: ObjectId(collectionId) }).limit(1)
    .lookup({ from: "places", localField: "places", foreignField: "_id", as: "places" })
    .project({
        _id: 1, name: 1, domain: 1, total: 1, type: 1,
        places: {
          $map: {
            input: "$places", as: "place",
            in: {
              _id: "$$place._id", name: "$$place.name",
              station: { $arrayElemAt: ["$$place.station", 0] },
              images: { $slice: ["$$place.images", 1] },
              isLiked: { $in: [userId, '$$place.liked'] },
              isMarked: { $in: [userId, '$$place.marked'] },
              isVisited: { $in: [userId, '$$place.visited'] },
            }
          }
        }
      }
    )
}

async function getCollectionsLastOrder(userId){
  return Collection.findOne({ userId }, { order: 1 }).sort({ order: -1 }).limit(1)
}

async function getUserName(userId){
  return User.findById(userId, { username: 1, _id: 0 })
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