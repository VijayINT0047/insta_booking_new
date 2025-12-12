const { required } = require("joi");
const mongoose = require("mongoose");
const applyTimestamps = require("../middlewares/timestampMiddleware");

const subplanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adultPrice: { type: Number, required: true },
  childPrice: { type: Number, required: true },
  adultActivity: { type: [String] },
  childActivity: { type: [String] },
  addOn: { type: [String] },
  facilities: { type: [String] },
  original_adult_price: { type: Number },
  original_child_price: { type: Number },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

applyTimestamps(subplanSchema);

module.exports = mongoose.model("plan_package", planpackageSchema);
