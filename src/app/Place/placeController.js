const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const placeProvider = require('./placeProvider');
const placeService = require('./placeService');
const { logger } = require("../../../config/winston");

exports.getCategory = async(req, res) => {
  const { station, time, domain } = req.query;
  let searchParams = {};
  if (station) searchParams['station'] = station;
  if (time) searchParams['time'] = Number(time);
  if (domain) searchParams['domain'] = domain;

  const result = await placeProvider.getCategory(searchParams);
  return res.send(result);
};

exports.getPlacesInToggle = async(req, res) => {
  const categoryId = req.params.categoryId;

  const { station, time, domain } = req.query;
  if (!categoryId) return res.send(errResponse(baseResponseStatus.CATEGORY_ID_EMPTY));

  let searchParams = {};
  if (station) searchParams['station'] = station;
  if (time) searchParams['time'] = Number(time);
  if (domain) searchParams['domain'] = domain;

  const result = await placeProvider.getPlacesInToggle(searchParams, categoryId);
  return res.send(result);
};

exports.getPlaces = async(req, res) => {
  const userIdFromJWT = req.verifiedToken.userId
  const { categoryId } = req.params;
  console.log(categoryId.length)
  const { station, time, domain, page } = req.query;
  if (!categoryId || categoryId === ":categoryId") return res.send(errResponse(baseResponseStatus.CATEGORY_ID_EMPTY));
  if (!page) return res.send(errResponse(baseResponseStatus.PAGE_FLAG_EMPTY));
  if (page < 0) return res.send(errResponse(baseResponseStatus.PAGE_FLAG_WRONG))

  let searchParams = {};
  if (station) searchParams['station'] = station;
  if (time) searchParams['time'] = Number(time);
  if (domain) searchParams['domain'] = domain;

  const result = await placeProvider.getPlaces(userIdFromJWT, searchParams, categoryId, Number(page));
  return res.send(result);
};

exports.getPlace = async(req, res) => {
  const userIdFromJWT = req.verifiedToken.userId
  const placeId = req.params.placeId;
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  const result = await placeProvider.getPlace(placeId, userIdFromJWT);
  return res.send(result)
}

exports.createPlace = async(req, res) => {
  const p = req.body;
  console.log(p);
  const createdPlace = await placeService.createPlace(p);
  return res.send(createdPlace);
};

exports.adminCreatePlaces = async(req, res) => {
  const createdPlaces = await placeService.imoprtPlaces();
  return res.send(createdPlaces);
};

exports.updatePlaces = async(req, res) => {
  const updatedPlaces = await placeService.updatePlaces();
  return res.send(updatedPlaces);
};

// 추천하기, 가본곳 (저장하기는 collection에서)
exports.updatePlaceStatus = async(req, res) => {
  const { domain, value } = req.body // -1, 1 둘 중 하나여야함.
  const userIdFromJWT = req.verifiedToken.userId
  const placeId = req.params.placeId;
  if (!placeId || placeId === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  if (!domain || !value) return res.send(errResponse(baseResponseStatus.PLACE_UPDATE_STATUS_EMPTY))
  const status = Number(value)
  if ((status !== 1 && status !== -1) || (domain !== "liked" && domain !== "visited"))
    return res.send(errResponse(baseResponseStatus.PLACE_UPDATE_STATUS_WRONG))
  const updatePlaceRes = await placeService.updatePlaceStatus(userIdFromJWT, placeId, status, domain)
  return res.send(updatePlaceRes)
}
