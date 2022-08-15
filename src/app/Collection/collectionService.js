const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { jwtsecret } = require('../../../config/secret');
const { logger } = require('../../../config/winston');
const collectionDao = require('./collectionDao');
const baseResponse = require("../../../config/baseResponseStatus");

exports.createCollection = async(userId, name) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName, autoIndex: true });
    let [createCollectionRes, last] = await Promise.all([collectionDao.createCollection(userId, name), collectionDao.getCollectionsLastOrder(userId)])
    if (last) createCollectionRes = await collectionDao.updateCollectionOrder(createCollectionRes._id, last.order + 1)
    const result = { _id: createCollectionRes._id }
    connection.disconnect()
    return response(baseResponseStatus.SUCCESS, result)
  } catch(err) {
    console.log({ err })
    logger.error(`App - createCollection Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.pushPlace = async(collectionId, placeId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const [collection, isPlaced] = await Promise.all([collectionDao.getCollection(collectionId), collectionDao.getPlaceInCollection(collectionId, placeId)])
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    if (isPlaced) return errResponse(baseResponseStatus.PLACE_ALREADY_EXIST_IN_COLLECTION)
    const pushed = await collectionDao.pushPlaceToCollection(collectionId, placeId)
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: "장소 추가 성공" })
  } catch(err) {
    logger.error(`App - pushPlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.deletePlaceInCollection = async(collectionId, placeId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const [collection, isPlaced] = await Promise.all([collectionDao.getCollection(collectionId), collectionDao.getPlaceInCollection(collectionId, placeId)])
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    if (!isPlaced) return errResponse(baseResponseStatus.PLACE_ALREADY_NOT_EXIST_IN_COLLECTION)
    const deleted = await collectionDao.deletePlaceInCollection(collectionId, placeId)
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message: "장소 제거 성공" })
  } catch(err) {
    logger.error(`App - deletePlaceInCollection Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.deleteCollection = async(collectionId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const deleted = await collectionDao.deleteCollection(collectionId)
    if (!deleted) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    const message = `${deleted.name} 다락방이 삭제되었습니다.`
    const { isSuccess, code } = baseResponse.SUCCESS;
    return response({ isSuccess, code, message })
  } catch(err) {
    console.log({ err })
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.patchCollectionName = async(collectionId, name) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const collection = await collectionDao.updateCollectionName(collectionId, name)
    const updated = { updatedName: collection.name }
    if (!collection) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    return response(baseResponseStatus.SUCCESS, updated)
  } catch(err) {
    logger.error(`App - patchCollectionName Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}
