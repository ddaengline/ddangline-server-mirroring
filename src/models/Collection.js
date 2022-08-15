// 수납장
// TODO: placeId 순서 배치는 어떻게 할 것인가?
// TODO: name unique 제거
const { Schema, model, Types } = require('mongoose');

const CollectionSchema = new Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: Types.ObjectId, required: true, ref: 'user' },
  total: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  places: [{ type: Types.ObjectId, ref: 'place' }],
}, { timestamps: true })

CollectionSchema.index({ userId: 1 })

const Collection = model('collection', CollectionSchema)
module.exports = { Collection }