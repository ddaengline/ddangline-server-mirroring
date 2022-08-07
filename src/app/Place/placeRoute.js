module.exports = function (app) {
  const place = require('./placeController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  app.get('/app/v1/category/places', jwtMiddleware, place.getCategory);
  app.get('/app/v1/{categoryId}/places');

  // TODO: 2차 배포
  // app.post('/app/v1/place', place.createPlace)

  // 장소 한 번에 import
  app.get('/admin/v1/places', place.adminCreatePlaces);
};
