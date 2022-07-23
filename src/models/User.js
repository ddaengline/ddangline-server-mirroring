const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['ACTIVE', 'SLEEP', 'WITHDRAWAL'], default: 'ACTIVE'},
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
module.exports = { User };
