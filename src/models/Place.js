const { Schema, model, Types } = require('mongoose');

const PlcaeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, enum: ['음식점', '카페', '주점', '문화생활'], required: true, trim: true, default: '음식점', trim: true },
    theme: { type: [], required: true, trim: true, trim: true },
    station: { type: [], required: true, trim: true, trim: true },
    address: { type: String, required: true, trim: true },
    walkTime: { type: Number, enum: [5, 10, 15, 20], required: true },
    link: { type: [], trim: true, trim: true },
    image: { type: [], trim: true, trim: true },

    tips: {
      type: [
        {
          _id: { type: Types.ObjectId, required: true, ref: 'tip' },
          userId: { type: Types.ObjectId, required: true, ref: 'user' },
          content: { type: String, requried: true, trim: true },
        },
      ],
    },
    totalLiked: { type: Number },
    liked: { type: [Types.ObjectId], ref: 'user' },
    totalMarkd: { type: Number },
    markd: { type: [Types.ObjectId], ref: 'user' },
    totalVisited: { type: Number },
    visited: { type: [Types.ObjectId], ref: 'user' },
  },
  { timestamps: true }
);

const Place = model('place', PlcaeSchema);
module.exports = { Place };
