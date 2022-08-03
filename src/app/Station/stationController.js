const baseResponseStatus = require('../../../config/baseResponseStatus');
const { errResponse } = require('../../../config/response');
const stationService = require('./stationService');

exports.getStations = async (req, res) => {
  const { name } = req.query;
  let findStation;
  if (!name) findStation = await stationService.getStations();
  else findStation = await stationService.getStation(name);
  return res.send(findStation);
};

exports.createStation = async (req, res) => {
  const { nameKR, nameEN, address } = req.body;
  console.log({ address });

  const createdStation = await stationService.createStation(nameKR, nameEN, address);
  return res.send(createdStation);
};

exports.createStations = async (req, res) => {
  const createdStation = await stationService.createStations();
  return res.send(createdStation);
};
