const collectionProvider = require('./collectionProvider')
const collectionService = require('./collectionService')
const { response, errResponse } = require("../../../config/response");
const baseResponseStatus = require('../../../config/baseResponseStatus');

exports.postCollection = async(req, res) => {
  const { name } = req.body
  const userIdFromJWT = req.verifiedToken.userId
  const n = name.trim()
  if (!n || n.length < 1) {
    return res.send(errResponse(baseResponseStatus.COLLECTION_NAME_EMPTY))
  }
  const createCollectionRes = await collectionService.createCollection(userIdFromJWT, n)
  return res.send(createCollectionRes)
}

exports.postPlace = async (req, res) =>{
  const collectionId = req.params.collectionId;
  const { placeId } = req.body
  const collection = collectionId.trim()
  if(!collection || collection === ':collectionId') return res.send(errResponse(baseResponseStatus.COLLECTION_ID_EMPTY))
  if(!placeId || placeId.length < 1) return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  const pushPlaceRes = await collectionService.pushPlace(collection, placeId.trim())
  return res.send(pushPlaceRes)
}

exports.getCollections = async (req, res) =>{
  const userIdFromJWT = req.verifiedToken.userId
  const getCollections = await collectionProvider.getCollections(userIdFromJWT)
  return res.send(getCollections)
}

exports.getCollection = async (req, res) => {
  const collectionId = req.params.collectionId;
  const collection = collectionId.trim()
  if(!collection || collection === ':collectionId') return res.send(errResponse(baseResponseStatus.COLLECTION_ID_EMPTY))
  const getCollectionRes = await collectionProvider.getCollection(collection)
  return res.send(getCollectionRes)
}

exports.updateCollectionName = async (req, res) => {
  const collectionId = req.params.collectionId;
  const { collectionName } = req.body
  const collection = collectionId.trim()
  const name = collectionName.trim()
  if(!collection || collection === ':collectionId') return res.send(errResponse(baseResponseStatus.COLLECTION_ID_EMPTY))
  if(!name || name.length < 1) return res.send(errResponse(baseResponseStatus.COLLECTION_UPDATE_NAME_EMPTY))
  const updateCollectionRes = await collectionService.patchCollectionName(collection, name)
  return res.send(updateCollectionRes)
}

exports.deletePlaceInCollection = async (req, res) => {
  const {collectionId, placeId} = req.params
  const collection = collectionId.trim()
  const place = placeId.trim()
  if(!collection || collection === ':collectionId') return res.send(errResponse(baseResponseStatus.COLLECTION_ID_EMPTY))
  if(!place || place === ':placeId') return res.send(errResponse(baseResponseStatus.PLACE_ID_EMPTY))
  const deletePlaceRes = await collectionService.deletePlaceInCollection(collection, place)
  return res.send(deletePlaceRes)
}

exports.deleteCollection = async (req, res) => {
  const collectionId = req.params.collectionId;
  const collection = collectionId.trim()
  if(!collection || collection === ':collectionId') return res.send(errResponse(baseResponseStatus.COLLECTION_ID_EMPTY))
  const deletedRes = await collectionService.deleteCollection(collection)
  return res.send(deletedRes)
}

