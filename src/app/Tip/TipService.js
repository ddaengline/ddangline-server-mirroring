const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");
const { MONGO_URI, dbName } = require("../../../config/secret");
const { logger } = require("../../../config/winston")
const ObjectId = mongoose.Types.ObjectId
const tipDao = require('./TipDao')
const placeProvider = require('../Place/placeProvider')

exports.createTip = async(userId, placeId, content) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const [createTipRes] = await tipDao.createTip(userId, placeId, content)
    return response(baseResponseStatus.SUCCESS, { _id: createTipRes._id })
  } catch(err) {
    logger.error(`App - createTip Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.deleteTip = async(placeId, tipId, userId) => {
  try {
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const [deleteTipRes] = await tipDao.deleteTip(tipId, placeId)
    let message = deleteTipRes.content
    if (message.length > 5) message = message.slice(0, 5) + "..."
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: `${message}이(가) 삭제되었습니다.` })
  } catch(err) {
    logger.error(`App - deleteTip Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}

exports.reportTip = async(userId, tipId, reasonIndex) => {
  try {
    const reasonObj = ["타인 혹은 가게에 대한 비방 및 욕설", "차별적/혐오 표현 포함", "스팸 및 홍보설 글", "음란물 포함", "기타"]
    const reason = reasonObj[reasonIndex]
    const connection = await mongoose.connect(MONGO_URI, { dbName });
    const isReported = await tipDao.isReported(userId, tipId)
    if (isReported) return errResponse(baseResponseStatus.TIP_ALREADY_REPORTED)
    const [, reportRes] = await tipDao.reportTip(userId, tipId, reason)
    let message = reportRes.content
    if (message.length > 5) message = message.slice(0, 5) + "..."
    const { isSuccess, code } = baseResponseStatus.SUCCESS;
    return response({ isSuccess, code, message: `${message}이(가) 신고되었습니다.` })
  } catch(err) {
    logger.error(`App - reportTip Service error\n: ${err.message}`)
    return errResponse(baseResponseStatus.DB_ERROR)
  }
}