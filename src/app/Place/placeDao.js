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
        .project({ _id: 1 });

    case 3: // search 화면
      return Place.aggregate()
        .match({ domain: { $in: [domain] }, walkTime: { $lte: time }, station: { $in: [station] } }) // in은 배열이여야함.
        .unwind({ path: '$theme' })
        .group({ _id: '$theme' })
  }
}

// 카테고리 안 가게 6개
async function getPlacesInToggle(categoryId, station, time, domain){
  switch (arguments.length) {
    case 1: // home 화면
      return Place.aggregate()
        .match({ theme: { $in: [categoryId] } })
        .project({
          _id: 1, name: 1,
          // image: { $arrayElemAt: ['$images', 0] }
        })
        .limit(6);

    case 4: // search 화면
      return Place.aggregate()
        .match({
          theme: { $in: [categoryId] },
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

async function getPlaces(userId, categoryId, pageOffSet, station, time, domain){
  // TODO: 좋아요 순 sort
  const limit = 10;
  const skip = limit * pageOffSet;
  switch (arguments.length) {
    // home
    case 3:
      return Place.aggregate()
        .match({ theme: { $in: [categoryId] } })
        .limit(skip + limit)
        // .sort({ field: 'asc', totalLiked: -1})
        .skip(skip)
        .project({
          _id: 1, name: 1, domain: 1,
          station: { $arrayElemAt: ['$station', 0] },
          images: 1,
          isLiked: { $in: [userId, '$liked'] },
          isMarked: { $in: [userId, '$marked'] },
          isVisited: { $in: [userId, '$visited'] },
        });
    case 6:
      // search
      return Place.aggregate()
        .match({
          theme: { $in: [categoryId] },
          domain: { $in: [domain] },
          walkTime: { $lte: time },
          station: { $in: [station] }
        })
        .limit(skip + limit)
        .skip(skip)
        // .sort({ field: 'asc', totalLiked: -1})
        .project({
          _id: 1, name: 1, domain: 1,
          station: { $arrayElemAt: ['$station', 0] },
          images: { $slice: ["$images", 2] },
          isLiked: { $in: [userId, '$liked'] },
          isMarked: { $in: [userId, '$marked'] },
          isVisited: { $in: [userId, '$visited'] },
        });
  }
}

async function getPlace(placeId, userId){
  return Place.findOne({ _id: placeId }, {
    _id: 1,
    name: 1,
    station: { $arrayElemAt: ['$station', 0] },
    domain: 1,
    "location.coordinates": 1,
    isLiked: { $in: [userId, '$liked'] },
    isMarked: { $in: [userId, '$marked'] },
    isVisited: { $in: [userId, '$visited'] },
    tips: 1,
    images: 1
  })
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

module.exports = {
  getCategory,
  getPlaces,
  getPlace,
  createPlace,
  createMany,
  getPlacesInToggle,
  updateDefault
};
