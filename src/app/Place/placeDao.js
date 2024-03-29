const { Place } = require('../../models/Place');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// 카테고리
async function getCategory(station, time, domain){
  switch (arguments.length) {
    case 0: // home 화면
      return Place.aggregate()
        .unwind({ path: '$theme' })
        .group({ _id: '$theme', count: { $sum: 1 } })
        .sort({ field: 'asc', count: -1 })
        .project({ _id: 1, count: 0 });

    case 3: // search 화면
      return Place.aggregate()
        .match({ domain: { $in: [domain] }, walkTime: { $lte: time }, station: { $in: [station] } }) // in은 배열이여야함.
        .unwind({ path: '$theme' })
        .group({ _id: '$theme', count: { $sum: 1 } })
        .sort({ field: 'asc', count: -1 })
        .project({ _id: 1, count: 0 })
  }
}

// 카테고리 안 가게 6개
async function getPlacesInToggle(categoryName, station, time, domain){
  switch (arguments.length) {
    case 1: // home 화면
      return Place.aggregate()
        .match({ theme: { $in: [categoryName] } })
        .project({
          _id: 1, name: 1,
          // image: { $arrayElemAt: ['$images', 0] }
        })
        .limit(6);

    case 4: // search 화면
      return Place.aggregate()
        .match({
          theme: { $in: [categoryName] },
          domain: { $in: [domain] },
          walkTime: { $lte: time },
          station: { $in: [station] }
        })
        .project({
          _id: 1, name: 1,
          // image: { $arrayElemAt: ['$images', 0] }
        })
        .limit(6);
  }
}

async function getPlaces(userId, categoryName, pageOffSet, station, time, domain){
  const limit = 10;
  const skip = limit * pageOffSet;
  switch (arguments.length) {
    // home
    case 3:
      return Place.aggregate()
        .match({ theme: { $in: [categoryName] } })
        .sort({ totalLiked: -1, _id: 1 })
        .limit(skip + limit)
        .skip(skip)
        .project({
          _id: 1, name: 1, domain: 1,
          station: { $arrayElemAt: ['$station', 0] },
          images: 1, totalLiked: 1,
          isLiked: { $in: [ObjectId(userId), '$liked'] },
          isMarked: { $in: [ObjectId(userId), '$marked'] },
          isVisited: { $in: [ObjectId(userId), '$visited'] },
        });
    case 6:
      // search
      return Place.aggregate()
        .match({
          theme: { $in: [categoryName] },
          domain: { $in: [domain] },
          walkTime: { $lte: time },
          station: { $in: [station] }
        })
        .sort({ totalLiked: -1, _id: 1 })
        .limit(skip + limit)
        .skip(skip)
        .project({
          _id: 1, name: 1, domain: 1,
          station: { $arrayElemAt: ['$station', 0] },
          images: { $slice: ["$images", 2] },
          totalLiked: 1,
          isLiked: { $in: [ObjectId(userId), '$liked'] },
          isMarked: { $in: [ObjectId(userId), '$marked'] },
          isVisited: { $in: [ObjectId(userId), '$visited'] },
        });
  }
}

async function getPlace(placeId, userId){
  switch (arguments.length) {
    case 1:
      return Place.findById(placeId)
    case 2:
      return Place.findOne({ _id: placeId }, {
        _id: 1,
        name: 1,
        station: 1,
        domain: 1,
        location : "$location.coordinates",
        totalLiked: 1,
        isLiked: { $in: [ObjectId(userId), '$liked'] },
        isMarked: { $in: [ObjectId(userId), '$marked'] },
        isVisited: { $in: [ObjectId(userId), '$visited'] },
        tips: 1,
        totalTips: 1,
        images: 1
      })
  }
}

async function createPlace(req){
  const place = new Place(req);
  const res = await place.save();
  return res;
}

async function createMany(places){
  const result = await Place.insertMany(places);
  return result;
}

// 가게 도메인 변경 API
async function updatePlaces(){
  return await Promise.all([
    Place.updateMany({ domain: 'restaurant' }, { $set: { domain: '음식점' } }),
    Place.updateMany({ domain: 'bar' }, { $set: { domain: '주점' } }),
    Place.updateMany({ domain: 'cafe' }, { $set: { domain: '카페' } }),
    Place.updateMany({ domain: 'culture' }, { $set: { domain: '문화생활' } }),
  ]);
}

// 가게 도메인 변경 API
async function updateDefault(){
  return Place.updateMany({}, { $set: { totalLiked: 0, totalMarked: 0, totalVisited: 0 } });
}

// Collection에서도 쓰임
async function updatePlaceStatus(placeId, userId, status, domain){
  if (domain === "liked") {
    if (status === 1) return Place.findByIdAndUpdate(placeId, { $push: { liked: userId }, $inc: { totalLiked: 1 } })
    else return Place.findByIdAndUpdate(placeId, { $pull: { liked: userId }, $inc: { totalLiked: -1 } })
  }
  if (domain === "marked") {
    if (status === 1) return Place.findByIdAndUpdate(placeId, { $push: { marked: userId }, $inc: { totalMarked: 1 } })
    else return Place.findByIdAndUpdate(placeId, { $pull: { marked: userId }, $inc: { totalMarked: -1 } })
  }
  if (domain === "visited") {
    if (status === 1) return Place.findByIdAndUpdate(placeId, { $push: { visited: userId }, $inc: { totalVisited: 1 } })
    else return Place.findByIdAndUpdate(placeId, { $pull: { visited: userId }, $inc: { totalVisited: -1 } })
  }
}

async function isCheck(placeId, userId, domain){
  if (domain === "liked") return Place.findOne({ _id: placeId, liked: userId })
  if (domain === "marked") return Place.findOne({ _id: placeId, marked: userId })
  if (domain === "visited") return Place.findOne({ _id: placeId, visited: userId })
}

module.exports = {
  getCategory,
  getPlaces,
  getPlace,
  createPlace,
  createMany,
  getPlacesInToggle,
  updateDefault,
  updatePlaceStatus, isCheck
};
