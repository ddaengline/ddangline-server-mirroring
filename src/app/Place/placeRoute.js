const place = require("./placeController");
module.exports = function(app){
  const place = require('./placeController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 카테고리 리스트
  app.get('/app/v1/places/category', jwtMiddleware, place.getCategory);
  // 가게 리스트 6개
  app.get('/app/v1/places/category/:categoryId/toggle', jwtMiddleware, place.getPlacesInToggle);
  // 가게 리스트 전부
  app.get('/app/v1/places/category/:categoryId', jwtMiddleware, place.getPlaces);
  // 가게 상세
  app.get('/app/v1/places/:placeId', jwtMiddleware, place.getPlace);
  // 추천하기, 가본곳 (저장하기는 collection에서)
  app.patch('/app/v1/places/:placeId/update', jwtMiddleware, place.updatePlaceStatus)
  // 가게 정보 변경
  // app.patch('/admin/v1/places', place.updatePlaces)
  // TODO: 2차 배포
  // app.post('/app/v1/place', place.createPlace)
  // 장소 한 번에 import
  app.get('/admin/v1/places', place.adminCreatePlaces);
  // TODO: 관광데이터포털
  app.get('/app/v1/places/tourism/tour', place.getTourism)
};
