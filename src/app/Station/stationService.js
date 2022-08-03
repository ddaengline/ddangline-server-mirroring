const mongoose = require('mongoose');
const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { MONGO_URI, dbName } = require('../../../config/secret');
const stationDao = require('./stationDao');
const fs = require('fs');
const path = require('path');
var appDir = path.dirname(require.main.filename);

exports.getStation = async (name) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const result = await stationDao.getStation(name);
    connection.disconnect();
    if (!result) return errResponse(baseResponseStatus.STATION_NOT_EXIST);
    return response(baseResponseStatus.SUCCESS, result);
  } catch (error) {
    console.log({ error });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.getStations = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const result = await stationDao.getStations();
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, result);
  } catch (error) {
    console.log({ error });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

// ADMIN
exports.createStation = async (nameKR, nameEN, address) => {
  try {
    const params = { nameKR, nameEN, address };
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const result = await stationDao.createStation(params);
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, result);
  } catch (error) {
    console.log({ error });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};

exports.createStations = async () => {
  try {
    const jsonFile = fs.readFileSync(appDir + '/src/app/Station/station.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const result = await stationDao.createStations(jsonData);
    connection.disconnect();
    return response(baseResponseStatus.SUCCESS, result);
  } catch (error) {
    console.log({ error });
    return errResponse(baseResponseStatus.DB_ERROR);
  }
};
