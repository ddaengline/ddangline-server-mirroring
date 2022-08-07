const { Schema, model, Types } = require('mongoose');

const TipSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: 'user' },
    plcaeId: { type: Types.ObjectId, required: true, ref: 'place' },
    content: { type: String, requried: true, trim: true },
  },
  { timestamps: true }
);

const Tip = model('tip', TipSchema);

module.exports = { Tip, TipSchema };
