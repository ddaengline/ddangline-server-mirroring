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
  // TODO: 좋아요, 마크, 가봤어요
  app.patch('/app/v1/places/:placeId/liked', jwtMiddleware, place.updatePlaceLiked)
  // app.patch('/app/v1/places/:placeId/marked', jwtMiddleware, place.updatePlaceMarked)
  // app.patch('/app/v1/places/:placeId/visited', jwtMiddleware, place.updatePlaceVisited)
  // TODO: Tip 추가

  // TODO: Tip에서 사용자 신고하기

  // TODO: Tip 삭제

  // TODO: Tip 수정

  // 가게 정보 변경
  // app.patch('/admin/v1/places', place.updatePlaces)

  // TODO: 2차 배포
  // app.post('/app/v1/place', place.createPlace)

  // 장소 한 번에 import
  app.get('/admin/v1/places', place.adminCreatePlaces);
};
