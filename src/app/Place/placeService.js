const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('../../../config/secret');
const placeDao = require('./placeDao');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');

const fs = require('fs');
const path = require('path');
var appDir = path.dirname(require.main.filename);

const readCSVPlaces = async () => {
  try {
    const csvFile = fs.readFileSync(appDir + '/src/app/Place/dummy.csv', 'utf-8');
    const rows = csvFile.split('\r\n');
    let title = [];
    let result = [];
    if (rows[rows.length - 1] === '') rows.pop();
    for (const i in rows) {
      const row = rows[i];
      const data = row.split(',');
      if (i === '0') {
        title = data;
        console.log({ title });
      } else {
        let row_data = {};
        for (const index in title) {
          const t = title[index];
          row_data[t] = data[index];
        }
        result.push(row_data);
      }
    }
    console.log({ result });
    return result;
  } catch (err) {
    console.log({ err });
  }
};

const readJSONPlaces = async () => {
  try {
    const jsonFile = fs.readFileSync(appDir + '/src/app/Place/places.json', 'utf8');
    return JSON.parse(jsonFile);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.imoprtPlaces = async () => {
  try {
    const result = await readJSONPlaces();

    const connection = await mongoose.connect(MONGO_URI, { dbName });
    connection.set('debug', true);
    const createdPlaces = await placeDao.createMany(result);
    connection.disconnect();

    return response(baseResponseStatus.SUCCESS, createdPlaces);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// 장소 추가
// TODO : 2차 배포때
exports.createPlace = async (req) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const createdPlace = await placeDao.createPlace(req);
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, createdPlace);
  } catch (err) {
    console.log({ err });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
