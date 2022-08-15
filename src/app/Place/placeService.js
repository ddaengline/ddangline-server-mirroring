const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const fs = require('fs');
const path = require('path');
const { json } = require("express");
const { logger } = require("../../../config/winston");
var appDir = path.dirname(require.main.filename);
const placeDao = require('./placeDao');
const collectionDao = require('../Collection/collectionDao')
const baseResponse = require("../../../config/baseResponseStatus");

const readCSVPlaces = async() => {
  try {
    const csvFile = fs.readFileSync(appDir + '/src/app/Place/dummy.csv', 'utf-8');
    const rows = csvFile.split('\r\n');
    let title = [];
    let result = [];
    if (rows[rows.length - 1] === '') rows.pop();
    for ( const i in rows ) {
      const row = rows[i];
      const data = row.split(',');
      if (i === '0') {
        title = data;
        console.log({ title });
      } else {
        let row_data = {};
        for ( const index in title ) {
          const t = title[index];
          row_data[t] = data[index];
        }
        result.push(row_data);
      }
    }
    console.log({ result });
    return result;
  } catch(err) {
    console.log({ err });
  }
};

const readJSONPlaces = async() => {
  try {
    const jsonFile = fs.readFileSync(appDir + '/src/app/Place/final.json', 'utf8');
    return JSON.parse(jsonFile);
  } catch(err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.imoprtPlaces = async() => {
  try {
    const jsonData = await readJSONPlaces();
    const result = await Promise.all(jsonData.map((data) => {
      return {
        name: data.name,
        station: data.station,
        walkTime: data.walkTime,
        address: data.address,
        domain: data.domain,
        theme: data.theme,
        location: {
          coordinates: [data.y, data.x]
        }
      }
    }))

    const connection = await mongoose.connect(MONGO_URI, { dbName });
    connection.set('debug', true);
    const createdPlaces = await placeDao.createMany(result);
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, createdPlaces);
  } catch(err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// 장소 doamin 변경
exports.updatePlaces = async() => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    mongoose.set('debug', true);
    const result = await placeDao.updateDefault();
    return response(baseResponseStatus.SUCCESS, result);
  } catch(err) {

    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.updatePlaceLiked = async(userId, placeId, liked) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    mongoose.set('debug', true);
    const [isLiked] = await placeDao.isLiked(placeId, userId)
    // 광클 방지
    if ((isLiked && liked === 1) || (!isLiked && liked === -1)) return response(baseResponseStatus.SUCCESS)
    await Promise.all([placeDao.updatePlaceLiked(placeId, userId, liked), collectionDao.updatePlaceLiked(userId, placeId, liked)])
    return response(baseResponseStatus.SUCCESS);
  } catch(err) {
    logger.error(`App - updatePlaceLiked Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR);
  }
}

// 장소 추가
// TODO : 2차 배포때
exports.createPlace = async(req) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const createdPlace = await placeDao.createPlace(req);
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, createdPlace);
  } catch(err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
