// const {Router}= require('express')
// const collectionRouter = Router({mergeParams: true})
const jwtMiddleware = require("../../../config/jwtMiddleware");
const collection = require("./collectionController");
module.exports = function(app){
  const collection = require('./collectionController')
  const jwtMiddleware = require('../../../config/jwtMiddleware')
  // 수납장 만들고, order 1씩 늘리기
  app.post('/app/v1/users/collections', jwtMiddleware, collection.postCollection)
  // TODO: 유저 수납장 > 특정 가게 추가에서 + 저장하기, 가게 순서 추가해야함
  app.post('/app/v1/users/collections/:collectionId', jwtMiddleware, collection.postPlace)
  // 마이페이지에서 내 수납장 리스트 보기
  app.get('/app/v1/users/collections', jwtMiddleware, collection.getCollections)
  // 가게상세 > 저장할 수납장 리스트 보기
  app.get('/app/v1/users/collections/save', jwtMiddleware, collection.getCollectionsToSave)
  // 특정 수납장 보기
  app.get('/app/v1/users/collections/:collectionId', jwtMiddleware, collection.getCollection)
  // TODO: 특정 수납장, 특정 가게 제거.. 가게 순서는 재정렬
  app.delete('/app/v1/users/collections/:collectionId/:placeId', jwtMiddleware, collection.deletePlace)
  // 특정 수납장 이름 변경
  app.patch('/app/v1/users/collections/:collectionId', jwtMiddleware, collection.updateCollectionName)
  // 특정 수납장 삭제
  app.delete('/app/v1/users/collections/:collectionId', jwtMiddleware, collection.deleteCollection)
  // TODO: 다락방 순서 변경
  // TODO: 특정 다락방 > 가게들 순서 변경
}

