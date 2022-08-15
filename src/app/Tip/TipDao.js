const { Tip } = require('../../models/Tip')

async function getTips(placeId){
  return Tip.find({ placeId }, { userId: 1, content: 1})
}

module.exports = {
  getTips,
}