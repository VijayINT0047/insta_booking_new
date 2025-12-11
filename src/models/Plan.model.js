const { required } = require("joi");
const mongoose = require("mongoose");
const applyTimestamps = require("../middlewares/timestampMiddleware")

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    timing: {
      fromtime: { type: String, required: true },
      totime: { type: String, required: true },
    },
    image_list: { type: [String], default: [] },
    plan_coupon: { type: [String], default: [] },
    subpackages: { type: [mongoose.Schema.Types.ObjectId], ref: "plan_package" },
    adult_age_renge: {
      type: Number,
      required: true,
      min: 11,
      max: 100,
    },
    child_age_renge: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    status: {
      type: Number,
      required: true,
      enum: ["open", "temporary closed", "closed"],
      default: "open"
    },
    gstPercentage: {
      type: Number,
      default: 18,
    },
    createdAt:{
        type:Date
    },
    updatedAt:{
        type:Date
    }
  });

  applyTimestamps(moduleSchema);

module.exports = mongoose.model("Plan", planSchema);
