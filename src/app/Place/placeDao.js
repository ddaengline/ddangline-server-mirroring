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

async function getRestaurant() {
  const result = await Place.find({ domain: 'restaurant' });
  console.log({ result });
  return result;
}

// 가게 도메인 변경 API
async function updatePlaces() {
  return await Promise.all([
    Place.updateMany({ domain: 'restaurant' }, { $set: { domain: '음식점' } }),
    Place.updateMany({ domain: 'bar' }, { $set: { domain: '주점' } }),
    Place.updateMany({ domain: 'cafe' }, { $set: { domain: '카페' } }),
    Place.updateMany({ domain: 'culture' }, { $set: { domain: '문화생활' } }),
  ]);
}

module.exports = { getCategory, getTotalCategory, createPlace, createMany, updatePlaces, getRestaurant };
