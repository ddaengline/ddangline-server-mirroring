const { Schema, model } = require('mongoose');

const MailAuthenticationSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    createdAt: { type: Date, required: true, expires: '3m', default: Date.now },
  },
);

const MailAuthentication = model('mailAuthentication', MailAuthenticationSchema);
module.exports = { MailAuthentication };
