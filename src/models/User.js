const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, trim: true },
    uniqueId: { type: String, enum: ['APPLE', 'KAKAO', 'GOOGLE'], default: 'APPLE', trim: true },
    password: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['ACTIVE', 'SLEEP', 'WITHDRAWAL'], default: 'ACTIVE'},
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
module.exports = { User };
