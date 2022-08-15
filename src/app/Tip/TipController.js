const { errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const tipProvider = require('./TipProvider')

exports.getTips = async(req, res) => {
  const placeId = req.params.placeId;
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))

  const getTipsRes = await tipProvider.getTips(placeId)
  return res.send(getTipsRes)
}