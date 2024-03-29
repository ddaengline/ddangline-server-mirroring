const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
  {
    username: { type: String, trim: true, default: "땡땡이" },
    email: { type: String, trim: true },
    social: {
      uniqueId: { type: String, unique: true, trim: true },
      type: { type: String, enum: ['APPLE', 'KAKAO', 'GOOGLE'], default: 'APPLE', trim: true },
    },
    password: { type: String, trim: true },
    status: { type: String, required: true, enum: ['ACTIVE', 'SLEEP', 'WITHDRAWAL'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
module.exports = { User };
