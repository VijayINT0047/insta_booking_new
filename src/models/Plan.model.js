 const mongoose = require("mongoose")
 
const planSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timing: {
        fromtime: {type: String, required:true},
        totime: {type: String, required: true},
    },
    image_list: { type: [String],  default:[]},
    plan_coupon: {type: [String], default: []},
    subpackages:  [ 
        {
            name: {type: String, required: true},
            adultPrice: {type: Number},
            childPrice: {type: Number},
            adult_activities: {type: [String], default:[]},
            child_activities: {type: [String], default : []},
            addOn: {type: [String], default: []},
            facilities: {type: [String], default: []},

        }
    ],
    map: { type: String },
    maxAdults: { type: String },
    maxYouth: { type: String },
    // createdAt: {type: Date},
    // priceAdult: { type: Number, required: true }, // it will be in sub plan
    // priceChild: { type: Number, required: true }, // it will be in sub plan
    // date: { type: String, required: true },
    // time: { type: String, required: true },
    // location: { type: String, required: true },
    // venue: { type: String, required: true },
    // tags: { type: [String], required: true},
    // seatsAvailable: { type: Number, required: true }, // it will be in sub plan of movie
    // duration: { type: String, required: true },  // it will be in sub plan of movie
    // language: { type: String, required: true },   // it will be in sub plan of movie
    // rating: { type: String, required: true },
    // terms: { type: String, required: true },
}, {timestamps: true})

module.exports = mongoose.model ("Plan", planSchema)