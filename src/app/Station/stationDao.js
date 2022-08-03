const { Station } = require('../../models/Station');

async function getStation(nameEN) {
  const station = await Station.findOne({ nameEN }, { nameKR: 1, nameEN: 1 });
  return station;
}

async function getStations() {
  const station = await Station.find({}, { nameKR: 1, nameEN: 1 });
  return station;
}

async function createStation(params) {
  const station = new Station(params);
  const result = await station.save();
  return result;
}

async function createStations(params) {
  const station = await Station.insertMany(params);
  return station;
}

module.exports = { getStation, getStations, createStation, createStations };
