// 신고하기
const { Schema, model, Types } = require('mongoose')
const ReportSchema = new Schema({
  reporter: { type: Types.ObjectId, required: true, ref: 'user' },
  tip: {
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'tip' },
      userId: { type: Types.ObjectId, required: true, ref: 'user' },
      placeId: { type: Types.ObjectId, required: true, ref: 'place' },
      content: { type: String, required: true, trim: true },
    },
    required: true
  },
  reason: {
    type: String, require: true,
    enum: ["타인 혹은 가게에 대한 비방 및 욕설", "차별적/혐오 표현 포함", "스팸 및 홍보설 글", "음란물 포함", "기타"]
  }
}, { timestamps: true })
ReportSchema.index({ createdAt: -1 })
const Report = model('report', ReportSchema)
module.exports = { Report }