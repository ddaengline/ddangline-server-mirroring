const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");
const { MONGO_URI, dbName } = require("../../../config/secret");
const { logger } = require("../../../config/winston");
const tipDao = require('./TipDao')

exports.getTips = async(placeId, pageOffset) => {
  try {
    await mongoose.connect(MONGO_URI, { dbName });
    const result = await tipDao.getTips(placeId, pageOffset)
    return response(baseResponseStatus.SUCCESS, result)
  } catch(err) {
    console.log({ err })
    logger.error(`App - getTips Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}
