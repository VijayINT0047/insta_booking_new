const { ApiError, MESSAGE_TEMPLATES, ApiResponse } = require("../../constant/constant")
const { asyncHandler } = require("../../utils/apiHelper")
const {Image} = require("../../models/image.model")

const addImage = asyncHandler (async(req, res) => {
    const {name, images, description} = req.body

    if (!name ||  !images) throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("Images") );

    const processImages = Array.isArray(images)
                          ? images.map(i => String(i).trim()).filter(i => i.startsWith("https://") || i.startsWith("http://"))
                          : typeof images === "string"
                            ? images.split(",").map(i => i.trim()).filter(i => i.startsWith("https://") || i.startsWith("http://"))
                            : [];

                         

    const imagesResponse = await Image.create({
        name,
        description,
        images: processImages
    })

    return res
    .status(201)
    .json(new ApiResponse(201,imagesResponse, MESSAGE_TEMPLATES.CREATE_SUCCESS("Images")))
})