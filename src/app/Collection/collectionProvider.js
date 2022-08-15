const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const collectionDao = require('./collectionDao')
const { logger } = require("../../../config/winston");

// 마이페이지 > 내 수납장 리스트
exports.getCollections = async(userId) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const [{ username }, getCollectionsRes] = await Promise.all([collectionDao.getUserName(userId), collectionDao.getCollections(userId)])

    const res = { username, collectionSize: getCollectionsRes.length, collections: getCollectionsRes }
    connection.disconnect()
    return response(baseResponseStatus.SUCCESS, res)
  } catch(err) {
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

// 특정 수납장
exports.getCollection = async(userIdFromJWT, collectionId) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const [res] = await collectionDao.getCollection(userIdFromJWT, collectionId)
    if (!res) return errResponse(baseResponseStatus.COLLECTION_NOT_EXIST)
    connection.disconnect()
    return response(baseResponseStatus.SUCCESS, res)
  } catch(err) {
    console.log({ err })
    logger.error(`App - pushPlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}