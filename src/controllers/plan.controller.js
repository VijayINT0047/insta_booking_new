const {
  asyncHandler,
  ApiResponse,
  MESSAGE_TEMPLATES,
  ApiError,
} = require("../constant/constant");
// const Event = require("../models/Plan.model");
const Plan = require("../models/Plan.model");

// // ------------------------------- createEvent --------------------------------------------

const createPlan = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    timing,
    image_list,
    plan_coupon,
    Planpackages,
    map,
    adult_age_renge,
    child_age_renge,
    status,
    gstPercentage

  } = req.body;

  // Requried fied validation
  if (
    !title ||
    !description ||
    !timing ||
    !timing?.fromtime ||
    !timing?.totime ||
    !Array.isArray(subpackages) ||
    subpackages.length === 0
  )
    throw new ApiError(404, MESSAGE_TEMPLATES.MISSING_FIELDS("some fields"));

  if (title.length < 2)
    throw new ApiError(
      400,
      MESSAGE_TEMPLATES.INVALID_PAYLOAD("title is short")
    );
  if (description.length < 10)
    throw new ApiError(
      400,
      MESSAGE_TEMPLATES.INVALID_PAYLOAD("description is short")
    );
  if (description.length > 1000)
    throw new ApiError(
      400,
      MESSAGE_TEMPLATES.INVALID_PAYLOAD("description is long")
    );

  // conver string to array to filed which are array in schema
  const processImage = image_list
    ? typeof image_list === "string"
      ? image_list.split(",").map((i) => i.trim())
      : Array.isArray(image_list)
      ? image_list
      : []
    : [];
  const processPlanCuppon = plan_coupon
    ? typeof plan_coupon === "string"
      ? plan_coupon.split(",").map((i) => i.trim())
      : Array.isArray(plan_coupon)
      ? plan_coupon
      : []
    : [];

  const processPlanPackage = Planpackages
    ? typeof Planpackages === "string"
      ? Planpackages.split(",").map((i) => i.trim())
      : Array.isArray(Planpackages)
      ? Planpackages
      : []
    : [];

  


  const planResponse = await Plan.create({
    title,
    description,
    timing,
    image_list: processImage,
    plan_coupon: processPlanCuppon,
    subpackages: processSubpackages,
    map,
    adult_age_renge: adult_age_renge,
    child_age_renge: child_age_renge,
    status:status,
    gstPercentage:gstPercentage

    // createdAt: Date.now()
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        planResponse,
        MESSAGE_TEMPLATES.CREATE_SUCCESS("plan")
      )
    );
});

const getPlanByTitle = asyncHandler(async (req, res) => {
  const { title } = req.query;
  if (!title)
    throw new ApiError(401, MESSAGE_TEMPLATES.MISSING_FIELDS("Title"));
  const plan = await Plan.findOne({ title }).populate("plan_package");

  if (!plan) throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("Plan"));
  const planResponse = plan.toObject();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        planResponse,
        MESSAGE_TEMPLATES.FETCH_SUCCESS("Plan")
      )
    );
});


const getAllPlan= async (req,res)=>{
     let { page = 1, limit = 10 } = req.query;

    // Convert to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    // Validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        status: "error",
        message: "Page and limit must be positive numbers",
      });
    }

    const skip = (page - 1) * limit;

    const allPlan= await Plan.find().populate("plan_package")
      .skip(skip)     
      .limit(limit);


    res.json(allPlan)
}
module.exports = { createPlan, getPlanByTitle, getAllPlan };



