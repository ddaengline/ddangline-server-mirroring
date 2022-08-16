// 신고하기
const { Schema, model, Types } = require('mongoose')
const { TipSchema } = require('./Tip')
const ReportSchema = new Schema({
  from: { type: Types.ObjectId, required: true, ref: 'user' },
  where: { TipSchema },
  reason: {
    type: String,
    enum: ["타인 혹은 가게에 대한 비방 및 욕설", "차별적/혐오 표현 포함", "스팸 및 홍보설 글", "음란물 포함", "기타"], require: true
  }
}, { timestamps: true })
const Report = model('report', ReportSchema)
module.exports = { Report }