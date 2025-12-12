const applyTimestamps=require("../middlewares/timestampMiddleware")

const mongoose = require("mongoose")
const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description : {
        type: String
    },
    imagesURL:{
        type: String,
        required: true,
        default: []
    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,
    }
})

applyTimestamps(imageSchema)

module.exports = mongoose.model("Image", imageSchema)
