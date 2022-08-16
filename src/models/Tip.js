const { Schema, model, Types } = require('mongoose');
const TipSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: 'user' },
    placeId: { type: Types.ObjectId, required: true, ref: 'place' },
    content: { type: String, required: true, trim: true },
    reportedCount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);
TipSchema.index({ placeId: 1, userId: 1 })
const Tip = model('tip', TipSchema);
module.exports = { Tip, TipSchema };