const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const placeProvider = require('./placeProvider');
const placeService = require('./placeService');

exports.getCategory = async (req, res) => {
  const { station, time, domain } = req.query;
  let searchParams = {};
  if (station) searchParams['station'] = station;
  if (time) searchParams['time'] = Number(time);
  if (domain) searchParams['domain'] = domain

  const result = await placeProvider.getCategory(searchParams);
  return res.send(result);
};

exports.getPlaces = async(req, res) =>{
  const categoryId = req.params.categoryId
  if(!categoryId) return res.send(errResponse(baseResponseStatus.CATEGORY_ID_EMPTY))
  const { station, time, domain } = req.query;
  let searchParams = { categoryId };
  
  if (station) searchParams['station'] = station;
  if (time) searchParams['time'] = Number(time);
  if (domain) searchParams['domain'] = domain;

  const result = await placeProvider.getPlaces(searchParams);
  return res.send(result)
}

exports.createPlace = async (req, res) => {
  const p = req.body;
  console.log(p);
  const createdPlace = await placeService.createPlace(p);
  return res.send(createdPlace);
};

exports.adminCreatePlaces = async (req, res) => {
  const createdPlaces = await placeService.imoprtPlaces();
  return res.send(createdPlaces);
};

exports.updatePlaces = async (req, res) => {
  const updatedPlaces = await placeService.updatePlaces();
  return res.send(updatedPlaces);
}