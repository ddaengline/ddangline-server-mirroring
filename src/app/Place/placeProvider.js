const mongoose = require('mongoose');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { MONGO_URI, dbName } = require('../../../config/secret');
const placeDao = require('./placeDao');

mongoose.connect(MONGO_URI, { dbName });

exports.getCategory = async (searchParams) => {
  let result;
  let categories;
  try {
    if (Object.keys(searchParams).length === 0) {
      // home 화면, 좋아요 순
      categories = await placeDao.getTotalCategory();
    } else {
      // search 화면, 랜덤
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);
      categories = await placeDao.getCategory(station, time, domain);
    }
    result = { size: categories.length, categories };
    return response(baseResponseStatus.SUCCESS, result);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.getPlacesInToggle = async (searchParams, categoryId) => {
  try {
    let result;
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
    return response(baseResponseStatus.SUCCESS, result);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.getPlaces = async (userId, searchParams, categoryId) => {
  try {
    let result;
    // home 화면, 좋아요 순
    if (Object.keys(searchParams).length === 0) {
      result = await placeDao.getPlaces(userId, categoryId);
    }
    // search 화면, 랜덤
    else {
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);

      result = await placeDao.getPlaces(userId, categoryId, station, time, domain);
    }
    return response(baseResponseStatus.SUCCESS, result);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
