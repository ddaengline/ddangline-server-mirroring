const jwtMiddleware = require("../../../config/jwtMiddleware");
const place = require("./TipController");
module.exports = function(app){
  const jwtMiddleware = require('../../../config/jwtMiddleware');
  const place = require('./TipController')
  // TODO: 특정 가게 Tip 리스트 보기
  app.get('/app/v1/places/:placeId/tips', jwtMiddleware, place.getTips)
  // TODO: 특정 가게 Tip 추가
  app.post('/app/v1/places/:placeId/tips', jwtMiddleware, place.getTips)
  // TODO: 특정 가게 Tip 삭제
  app.delete('/app/v1/places/:placeId/tips/:tipId', jwtMiddleware, place.getTips)
  // TODO: 특정 가게 특정 Tip 신고하기
  app.post('/app/v1/places/:placeId/tips/:tipId/report', jwtMiddleware, place.getTips)
}