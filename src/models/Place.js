const { Schema, model, Types } = require('mongoose');
const PlcaeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, enum: ['음식점', '카페', '주점', '문화공간'], required: true, trim: true, default: '음식점' },
    theme: { type: [], required: true, trim: true },
    station: { type: [], required: true, trim: true },
    address: { type: String, required: true, trim: true },
    walkTime: { type: Number, enum: [5, 10, 15, 20], required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    link: { type: [], trim: true }, // todo: 없애야하는 필드
    images: { type: [], trim: true },
    totalTips: { type: Number, required: true, default: 0 }, // computed field
    tips: [{
      _id: { type: Types.ObjectId, ref: 'tip' },
      userId: { type: Types.ObjectId, required: true, ref: 'user' },
      content: { type: String, required: true, trim: true },
    }],
    totalLiked: { type: Number, default: 0 },
    liked: { type: [Types.ObjectId], ref: 'user' },
    totalMarked: { type: Number, default: 0 },
    marked: { type: [Types.ObjectId], ref: 'user' },
    totalVisited: { type: Number, default: 0 },
    visited: { type: [Types.ObjectId], ref: 'user' },
  },
  { timestamps: true }
);
PlcaeSchema.index({ domain: 1, station: 1, walkTime: 1 })

const Place = model('place', PlcaeSchema);
module.exports = { Place };
