const mongoose = require("mongoose");
const { Tip } = require('../../models/Tip')
const { Place } = require('../../models/Place')
const { Report } = require("../../models/Report");
const ObjectId = mongoose.Types.ObjectId

async function getTips(placeId, pageOffset){
  const limit = 10;
  const page = pageOffset * limit;
  // sort + limit 하려면, sort 하는 값이 unique 해야함.
  return Tip.find({ placeId, reportedCount: { $lt: 10 } }, { userId: 1, content: 1 })
    .sort({ createdAt: -1, _id: 1 }).limit(page + limit).skip(page)
}

async function getTip(tipId){
  return Tip.findById(tipId)
}

async function createTip(userId, placeId, content){
  const tip = new Tip({ userId, placeId, content })
  const place = await Place.findById(placeId)
  if (place.tips.length > 9) place.tips.pop()
  place.tips.unshift(tip)
  place.totalTips++;
  // Place.findOneAndUpdate({ _id: placeId, "tips.9": { $exists: true } },{ $pop: { tips: -1 }, $push: { $each: [tip], $position: 0 }, $inc: { totalTips: 1 } })
  // Place.findOneAndUpdate({ _id: placeId }, {
  //   $set: {
  //     $cond: [{ "$tips.9": { $exists: true } },
  //       { $pop: { tips: -1 }, $push: { tips: { $each: [tip], $position: 0 } }, $inc: { totalTips: 1 } },
  //       { $push: { tips: { $each: [tip], $position: 0 } }, $inc: { totalTips: 1 } }]
  //   }
  // })
  return Promise.all([tip.save(), place.save()])
}

async function deleteTip(tipId, placeId){
  return Promise.all([Tip.findOneAndDelete({ _id: tipId }, { _id: 1 }),
    Place.findOneAndUpdate({ _id: placeId, "tips._id": tipId }, {
      $pull: { tips: { _id: tipId } },
      $inc: { totalTips: -1 }
    })])
}

async function reportTip(userId, tipId, reason){
  const reportedTip = await getTip(tipId)
  const report = new Report({ reporter: userId, tip: reportedTip, reason })
  return Promise.all([report.save(), Tip.findOneAndUpdate({ _id: tipId }, { $inc: { reportedCount: 1 } }, { new: true })])
}

async function isReported(userId, tipId){
  return Report.findOne({ reporter: userId, "tip._id": tipId })
}

module.exports = {
  getTips, getTip, createTip, deleteTip, reportTip, isReported
}