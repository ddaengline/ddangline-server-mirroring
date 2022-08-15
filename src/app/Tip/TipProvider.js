const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");
const { MONGO_URI, dbName } = require("../../../config/secret");
const tipDao = require('./TipDao')

exports.getTips = async(placeId) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const result = await tipDao.getTips(placeId)

  } catch(err) {
    console.log({ err })
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}