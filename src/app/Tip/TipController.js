const { errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const tipProvider = require('./TipProvider')
const tipService = require('./TipService')
const mongoose = require("mongoose");

exports.getTips = async(req, res) => {
  const placeId = req.params.placeId;
  const { page = 0 } = req.query;
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  if (!mongoose.isValidObjectId(placeId)) return res.send(errResponse(baseResponseStatus.PLACE_ID_WRONG))
  const getTipsRes = await tipProvider.getTips(placeId, page)
  return res.send(getTipsRes)
}

exports.postTip = async(req, res) => {
  const userIdFromJWT = req.verifiedToken.userId
  const placeId = req.params.placeId;
  const { content } = req.body
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  if (!mongoose.isValidObjectId(placeId)) return res.send(errResponse(baseResponseStatus.PLACE_ID_WRONG))
  if (!content || content === "") return res.send(errResponse(baseResponseStatus.TIP_CONTENT_EMPTY))
  if (typeof (content) !== "string" || content.length > 30) return res.send(errResponse(baseResponseStatus.TIP_CONTENT_LENGTH))
  const createTipsRes = await tipService.createTip(userIdFromJWT, placeId, content)
  return res.send(createTipsRes)
}

exports.deleteTip = async(req, res) => {
  const { placeId, tipId } = req.params
  const userIdFromJWT = req.verifiedToken.userId
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  if (!tipId || tipId === ':tipId') return res.send(errResponse(baseResponseStatus.TIP_ID_EMPTY))
  if (!mongoose.isValidObjectId(tipId)) return res.send(errResponse(baseResponseStatus.TIP_ID_NOT_MATCH))
  if (!mongoose.isValidObjectId(placeId)) return res.send(errResponse(baseResponseStatus.PLACE_ID_WRONG))
  const getTipsRes = await tipService.deleteTip(placeId, tipId, userIdFromJWT)
  return res.send(getTipsRes)
}

exports.reportTip = async(req, res) => {
  const { placeId, tipId } = req.params
  let { reason } = req.body;
  const userIdFromJWT = req.verifiedToken.userId
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  if (!tipId || tipId === ':tipId') return res.send(errResponse(baseResponseStatus.TIP_ID_EMPTY))
  if (!mongoose.isValidObjectId(tipId)) return res.send(errResponse(baseResponseStatus.TIP_ID_NOT_MATCH))
  if (!mongoose.isValidObjectId(placeId)) return res.send(errResponse(baseResponseStatus.PLACE_ID_WRONG))
  if (reason !== 0 && !reason) return res.send(errResponse(baseResponseStatus.REPORT_REASON_EMPTY))
  reason = Number(reason)
  if (reason < 0 || reason > 4) return res.send(errResponse(baseResponseStatus.REPORT_REASON_WRONG))
  const getTipsRes = await tipService.reportTip(userIdFromJWT, tipId, reason)
  return res.send(getTipsRes)
}
