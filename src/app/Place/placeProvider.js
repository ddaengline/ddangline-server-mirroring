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
      // 랜덤
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
