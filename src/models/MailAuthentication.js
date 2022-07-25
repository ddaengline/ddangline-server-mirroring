const { Schema, model } = require('mongoose');

const MailAuthenticationSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const MailAuthentication = model('mailAuthentication', MailAuthenticationSchema);
module.exports = { MailAuthentication };
