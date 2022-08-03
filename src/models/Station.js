const { Schema, model } = require('mongoose');

const StationAddressSchema = new Schema({
  line: { type: String, required: true, trim: true },
  stationCD: {type: Number, required: true},
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
}, {_id:false})

const StationSchema = new Schema(
  {
    nameKR: { type: String, required: true, trim: true },
    nameEN: { type: String, required: true, trim: true },
    address: { type: [StationAddressSchema], required: true, },
  },
  { timestamps: true }
);

const Station = model('station', StationSchema);
module.exports = { Station };