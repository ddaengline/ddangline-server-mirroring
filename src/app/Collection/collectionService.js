const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { logger } = require('../../../config/winston');
const collectionDao = require('./collectionDao');
const placeDao = require('../Place/placeDao')

exports.createCollection = async(userId, name) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName, autoIndex: true });
    let [createCollectionRes, last] = await Promise.all([collectionDao.createCollection(userId, name), collectionDao.getCollectionsLastOrder(userId)])
    if (last) createCollectionRes = await collectionDao.updateCollectionOrder(createCollectionRes._id, last.order + 1)
    else {
      await Promise.all([collectionDao.createCollection(userId), collectionDao.updateCollectionOrder(createCollectionRes._id, 1)])
    }
    const result = { _id: createCollectionRes._id }
    connection.disconnect()
    return response(baseResponseStatus.SUCCESS, result)
  } catch(err) {
    logger.error(`App - createCollection Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

// 1. 저장하기
// 2. 내 수납장(type == USER)에 추가 + 저장하기
exports.pushPlace = async(userId, collectionId, placeId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const [collection, isPlaced, isMarked] = await Promise.all([collectionDao.getCollection(collectionId),
      collectionDao.getPlaceInCollection(collectionId, placeId), collectionDao.getMarkedHasPlace(userId, placeId)])
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    if (isPlaced) return errResponse(baseResponseStatus.PLACE_ALREADY_EXIST_IN_COLLECTION)
    if (collection.type === "USER") {
      if (!isMarked) {  // 유저가 만든 컬렉션에 넣고싶은데, 저장 안되어있다 => 유저 컬렉션, 저장하기 둘 다 추가 O
        await Promise.all([collectionDao.pushPlaceToCollection(collectionId, placeId),
          collectionDao.pushPlaceToMarked(userId, placeId), placeDao.updatePlaceStatus(placeId, userId, 1, "marked")
        ])
      } else { // 유저가 만든 컬렉션에 넣고싶은데, 이미 저장 되어있다 => 유저가 만든 컬렉션에만 추가, 저장하기에는 추가 x
        await collectionDao.pushPlaceToCollection(collectionId, placeId)
      }
    }
    // 저장하기에 추가하고싶은데, 저장이 안 된 => ( 저장하기 )
    else await Promise.all([collectionDao.pushPlaceToCollection(collectionId, placeId),
      placeDao.updatePlaceStatus(placeId, userId, 1, "marked")])
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: "장소 추가 성공" })
  } catch(err) {
    console.log({ err })
    logger.error(`App - pushPlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

// 1. 저장하기 해제
// 2. 내 수납장에서 제거 + 저장하기 해제
exports.deletePlace = async(userId, collectionId, placeId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const [collection, isPlaced, isUsers] = await Promise.all([collectionDao.getCollection(collectionId),
      collectionDao.getPlaceInCollection(collectionId, placeId), collectionDao.getUserCollectionsHavePlace(userId, placeId)])
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    if (!isPlaced) return errResponse(baseResponseStatus.PLACE_ALREADY_NOT_EXIST_IN_COLLECTION)
    if (collection.type === "MARKED") {
      if (Array.isArray(isUsers) && isUsers.length === 0) { // 저장하기에서 빼고싶은데, 유저들에는 없다 => 저장하기에서만 빠짐
        await Promise.all([collectionDao.deletePlaceInCollection(collectionId, placeId),
          placeDao.updatePlaceStatus(placeId, userId, -1, "marked")])
      } else { // 저장하기에서 빼고싶은데, 유저들에도 있다 => 저장하기, 유저 둘 다 빠짐
        await Promise.all([collectionDao.deletePlaceInCollection(collectionId, placeId),
          collectionDao.deletePlacesInUser(userId, placeId),
          placeDao.updatePlaceStatus(placeId, userId, -1, "marked")])
      }
    } else {
      if (Array.isArray(isUsers) && isUsers.length === 1) { // 유저에서 빼고싶은데, 다른 유저에 없다 => 유저, 저장하기 둘 다 뺌
        await Promise.all([collectionDao.deletePlaceInCollection(collectionId, placeId),
          collectionDao.deletePlaceInMarked(userId, placeId),
          placeDao.updatePlaceStatus(placeId, userId, -1, "marked")])
      } else {  // 유저에서 빼고싶은데, 다른 유저에 있다 => 유저만 빼고, 저장하기 안뺌
        await collectionDao.deletePlaceInCollection(collectionId, placeId)
      }
    }
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: "장소 제거 성공" })
  } catch(err) {
    logger.error(`App - deletePlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.deleteCollection = async(collectionId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const deleted = await collectionDao.deleteCollection(collectionId)
    if (!deleted) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    const message = `${deleted.name} 수납장이 삭제되었습니다.`
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message })
  } catch(err) {
    logger.error(`App - deleteCollection Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.patchCollectionName = async(collectionId, name) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const collection = await collectionDao.updateCollectionName(collectionId, name)
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    const updated = { updatedName: collection.name }
    return response(baseResponseStatus.SUCCESS, updated)
  } catch(err) {
    logger.error(`App - patchCollectionName Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}
