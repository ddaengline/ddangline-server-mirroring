const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
  {
    username: { type: String, trim: true, default: "땡땡이" },
    email: { type: String, trim: true },
    social: {
      uniqueId: { type: String, unique: true, trim: true },
      type: { type: String, enum: ['APPLE', 'KAKAO', 'GOOGLE'], default: 'APPLE', trim: true },
    },
    password: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['ACTIVE', 'SLEEP', 'WITHDRAWAL'], default: 'ACTIVE' },
    totalLiked: { type: Number, default: 0 },
    liked: { type: [Types.ObjectId], ref: 'place' },
    totalMarked: { type: Number, default: 0 },
    marked: { type: [Types.ObjectId], ref: 'place' },
    totalVisited: { type: Number, default: 0 },
    visited: { type: [Types.ObjectId], ref: 'place' },
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
module.exports = { User };
