const mongoose = require('mongoose');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { MONGO_URI, dbName } = require('../../../config/secret');
const placeDao = require('./placeDao');
const { logger } = require("../../../config/winston");

exports.getCategory = async(searchParams) => {
  let result;
  let categories;
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    if (Object.keys(searchParams).length === 0) {
      // home 화면, 좋아요 순
      categories = await placeDao.getCategory();
    } else {
      // search 화면, 랜덤
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);
      categories = await placeDao.getCategory(station, time, domain);
    }
    connection.disconnect();
    result = { size: categories.length, categories };
    return response(baseResponseStatus.SUCCESS, result);
  } catch(err) {
    logger.error(`App - getCategory Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.getPlacesInToggle = async(searchParams, categoryId) => {
  try {
    let result;
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    // home 화면, 좋아요 순
    if (Object.keys(searchParams).length === 0) result = await placeDao.getPlacesInToggle(categoryId);
    // search 화면, 랜덤
    else {
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);
      result = await placeDao.getPlacesInToggle(categoryId, station, time, domain);
    }
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, result);
  } catch(err) {
    logger.error(`App - getPlacesInToggle Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// 장소 list
exports.getPlaces = async(userId, searchParams, categoryId, pageOffSet) => {
  try {
    let result;
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    // home 화면, 좋아요 순
    if (Object.keys(searchParams).length === 0) {
      result = await placeDao.getPlaces(userId, categoryId, pageOffSet);
    }
    // search 화면, 랜덤
    else {
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);

      result = await placeDao.getPlaces(userId, categoryId, pageOffSet, station, time, domain);
    }
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, result);
  } catch(err) {
    logger.error(`App - getPlaces Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// 특정 장소 상세
exports.getPlace = async(placeId, userIdFromJWT) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName })
    const result = await placeDao.getPlace(placeId, userIdFromJWT)
    connection.disconnect()
    return response(baseResponseStatus.SUCCESS, result)
  } catch(err) {
    logger.error(`App - getPlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}