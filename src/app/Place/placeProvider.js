const mongoose = require('mongoose');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { MONGO_URI, dbName } = require('../../../config/secret');
const placeDao = require('./placeDao');
const { logger } = require("../../../config/winston");
const https = require("https");
const axios = require("axios");
const Tour = require('./TourApi')
const TourAPI = "관광공사 추천하는 문화공간"

exports.getCategory = async(searchParams) => {
  let result;
  let categories;
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    if (Object.keys(searchParams).length === 0) {
      // home 화면, 좋아요 순
      categories = await placeDao.getCategory();
      categories.unshift({ _id: TourAPI })  // 투어 api 추가
    } else {
      // search 화면, 랜덤
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);
      categories = await placeDao.getCategory(station, time, domain);
      if (domain === "문화시설") categories.unshift({ _id: TourAPI })  // 투어 api 추가
    }
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
    return response(baseResponseStatus.SUCCESS, result);
  } catch(err) {
    logger.error(`App - getPlacesInToggle Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// 장소 list
// TODO : AXIOS 에러 처리
exports.getPlaces = async(userId, searchParams, categoryId, pageOffSet) => {
  try {
    let result;
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    // home 화면, 좋아요 순
    if (Object.keys(searchParams).length === 0) {
      if (categoryId === TourAPI) {
        try {
          const tourData = await Tour.getTourAPIAreaBasedList(pageOffSet)
          result = tourData.map(place => {
            return {
              _id: place.contentid,
              name: place.title,
              images: [place.firstimage],
              station: "한국관광공사추천", domain: "문화공간",
              isLiked: false, isMarked: false, isVisited: false,
            }
          })
        } catch(error) { // axios 에러
          console.log({ error })
        }
      } else result = await placeDao.getPlaces(userId, categoryId, pageOffSet);
    }
    // search 화면, 랜덤
    else {
      const { station, time, domain } = searchParams;
      if (!station) return errResponse(baseResponseStatus.PLACE_STATION_EMPTY);
      if (!time) return errResponse(baseResponseStatus.PLACE_TIME_EMPTY);
      if (!domain) return errResponse(baseResponseStatus.PLACE_DOMAIN_EMPTY);
      if (categoryId === TourAPI && domain === '문화공간') {
        try {
          const tourData = await Tour.getTourAPILocationBasedList(station, time, pageOffSet)
          result = tourData.map(place => {
            return {
              _id: place.contentid,
              name: place.title,
              station, domain,
              images: [place.firstimage],
              isLiked: false, isMarked: false, isVisited: false
            }
          })
        } catch(error) { // axios 에러
          console.log({ error })
        }
      } else result = await placeDao.getPlaces(userId, categoryId, pageOffSet, station, time, domain);
    }
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
    let result;
    if (mongoose.isValidObjectId(placeId)) result = await placeDao.getPlace(placeId, userIdFromJWT)
    else {
      const tourData = await Tour.getTourAPIDetailCommon(placeId)
      result = tourData.map(place => {
        return {
          _id: place.contentid,
          name: place.title,
          station: "한국관광공사추천", domain: "문화공간",
          location: [place.mapx, place.mapy],
          images: [place.firstimage, place.firstimage2],
          isLiked: false, isMarked: false, isVisited: false, tips: [], totalTips: 0, totalLiked: 0
        }
      })
    }
    return response(baseResponseStatus.SUCCESS, result)
  } catch(err) {
    logger.error(`App - getPlace Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}