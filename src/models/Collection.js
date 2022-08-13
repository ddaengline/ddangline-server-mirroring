const { Schema, model, Types } = require('mongoose');

const CollectionSchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true },
  userId: { type: Types.ObjectId, required: true, ref: 'user' },
  total: { type: Number, default: 0 },
  places: [{ type: Types.ObjectId, ref: 'place' }],
}, { timestamps: true })

CollectionSchema.index({userId: 1})

const Collection = model('collection', CollectionSchema)
module.exports = { Collection }