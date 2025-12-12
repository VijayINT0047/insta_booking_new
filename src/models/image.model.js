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
    }
})

module.exports = mongoose.model("Image", imageSchema)