const { Place } = require('../../models/Place');

async function getCategory(station, time, domain) {
  const category = Place.aggregate()
    .match({ domain: { $in: [domain] }, walkTime: time, station: { $in: [station] } }) // in은 배열이여야함.
    .unwind({ path: '$theme' })
    .group({ _id: '$theme' });
  return category;
}

// 카레고리 안에 장소들 많은 순
async function getTotalCategory() {
  const category = Place.aggregate()
    .unwind({ path: '$theme' })
    .group({ _id: '$theme', count: { $sum: 1 } })
    .sort({ field: 'asc', count: -1 })
    .project({ _id: 1 });
  return category;
}

async function createPlace(req) {
  const place = new Place(req);
  const res = await place.save();
  return res;
}

async function createMany(places) {
  const result = await Place.insertMany(places);
  return result;
}

module.exports = { getCategory, getTotalCategory, createPlace, createMany };
