module.exports = function (app) {
  const station = require('./stationController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  app.get('/app/v1/stations', station.getStations);

  // ADMIN
  // app.post('/app/v1/stations', station.createStation);
  // app.get('/app/v1/stations/all', station.createStations);
};
