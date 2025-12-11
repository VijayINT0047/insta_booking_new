const { asyncHandler, ApiResponse, MESSAGE_TEMPLATES, ApiError } = require("../constant/constant");
// const Event = require("../models/Plan.model");
const Plan = require("../models/subPlan.model");

// // ------------------------------- createEvent --------------------------------------------

const plan = asyncHandler(async(req, res) => {
    const { 
            title, description,
            timing, image_list,
            plan_coupon, subpackages,
            map, maxAdults,
            maxYouth
            } = req.body;
    
// Requried fied validation
    if (   !title|| !description || !timing || !timing?.fromtime || !timing?.totime || !Array.isArray(subpackages) || subpackages.length === 0) throw new ApiError(404, MESSAGE_TEMPLATES.MISSING_FIELDS("some fields"))
    
    if (title.length < 2) throw new ApiError(400, MESSAGE_TEMPLATES.INVALID_PAYLOAD("title is short"))
    if (description.length < 10) throw new ApiError(400, MESSAGE_TEMPLATES.INVALID_PAYLOAD("description is short"))
    if (description.length > 1000) throw new ApiError(400, MESSAGE_TEMPLATES.INVALID_PAYLOAD("description is long"))


// conver string to array to filed which are array in schema    
    const processImages = Array.isArray(image_list)
                          ? image_list.map(i => String(i).trim()).filter(i => i.startsWith("https://") || i.startsWith("http://"))
                          : typeof image_list === "string"
                            ? image_list.split(",").map(i => i.trim()).filter(i => i.startsWith("https://") || i.startsWith("http://"))
                            : [];
    const processPlanCuppon = Array.isArray(plan_coupon)
                          ? plan_coupon.map(i => String(i).trim().toUpperCase()).filter(i => i.length>0 )
                          : typeof plan_coupon === "string"
                            ? plan_coupon.split(",").map(i => i.trim().toUpperCase()).filter(i => i.length>0 )
                            : [];


    const processSubpackages = subpackages.map(sub => ({
        ...sub,
        adult_activities: Array.isArray(sub.adult_activities) ? sub.adult_activities.map(i => String(i).trim()).filter(i => i.length>0): typeof(sub.adult_activities) === "string"? sub.adult_activities.split(',').map(i => i.trim()).filter(i => i.length>0) : [],
        child_activities: Array.isArray(sub.child_activities) ? sub.child_activities.map(i => String(i).trim()).filter(i => i.length>0): typeof(sub.child_activities) === "string"? sub.child_activities.split(',').map(i => i.trim()).filter(i => i.length>0) : [],
        addOn: Array.isArray(sub.addOn) ? sub.addOn.map(i => String(i).trim()).filter(i => i.length>0): typeof(sub.addOn) === "string"? sub.addOn.split(',').map(i => i.trim()).filter(i => i.length>0) : [],
        facilities: Array.isArray(sub.facilities) ? sub.facilities.map(i => String(i).trim()).filter(i => i.length>0): typeof(sub.facilities) === "string"? sub.facilities.split(',').map(i => i.trim()).filter(i => i.length>0) : [],
        
        // adult_activities : typeof sub.adult_activities==="string"? sub.adult_activities.split(',').map(i => i.trim()): sub.adult_activities || [],
        // sub.child_activities : typeof sub.child_activities==="string"? sub.child_activities.split(',').map(i => i.trim()): sub.child_activities || [],
        // sub.addOn : typeof sub.addOn==="string"? sub.addOn.split(',').map(i => i.trim()): sub.addOn || [],
        // sub.facilities : typeof sub.facilities==="string"? sub.facilities.split(',').map(i => i.trim()): sub.facilities || []
    }))

    let processMaxAdult = maxAdults
    if (maxAdults) {
        processMaxAdult =  typeof maxAdults === "string" 
                                ? Number(maxAdults) 
                                : maxAdults;
        if (isNaN(processMaxAdult)) {throw new ApiError (401, MESSAGE_TEMPLATES.INVALID_PAYLOAD("maxAdults must be valid number"))}
    }

    let processMaxYouth = maxYouth
    if (maxYouth) {
            processMaxYouth =  typeof maxYouth === "string"
                                    ? Number(maxYouth) 
                                    : maxYouth  ;

            if (isNaN(processMaxYouth)) throw new ApiError (401, MESSAGE_TEMPLATES.INVALID_PAYLOAD("maxYouth must be valid number"))
    }


    const planResponse = await Plan.create({
         title, 
        description,
        timing, 
        image_list:processImage ,
        plan_coupon: processPlanCuppon, 
        subpackages: processSubpackages,
        map, 
        maxAdults:processMaxAdult,
        maxYouth: processMaxYouth,
        // createdAt: Date.now()
    })

    return res
    .status(201)
    .json( new ApiResponse(201, planResponse, MESSAGE_TEMPLATES.CREATE_SUCCESS("plan")))

})







const getPlan = asyncHandler(async(req, res) => {
    const{title} = req.query
    if (!title) throw new ApiError(401, MESSAGE_TEMPLATES.MISSING_FIELDS("Title"))
    const plan = await Plan.findOne({title})

    if (!plan) throw new ApiError (404, MESSAGE_TEMPLATES.NOT_FOUND("Plan"))
    const planResponse = plan.toObject();

    return res.status(201).json(new ApiResponse(201, planResponse, MESSAGE_TEMPLATES.FETCH_SUCCESS("Plan")))
})





module.exports ={ plan, getPlan}
















// ------------------------------- createSubplan --------------------------------------------

// const createSubplan = asyncHandler(async(req, res) => {
//     const {name, adultPrice, childPrice, adultActivity, 
//         childActivity, addOn, facilities, original_adult_price, 
//         original_child_price} =req.body
    
//     const existingPlan = await Subplan.findOne({name})
//     if(existingPlan) throw new ApiError(409,MESSAGE_TEMPLATES.ALREADY_EXISTS("Sub Plan"))

//     let AdultActivity = adultActivity
//     if (typeof adultActivity === "string") {
//         AdultActivity = adultActivity.split(",").map(t => t.trim());
//     }

//     let ChildActivity = childActivity
//     if (typeof childActivity === "string") {
//         ChildActivity = childActivity.split(",").map(t => t.trim());
//     }
    
//     let AddOn = addOn
//     if (typeof addOn === "string") {
//         AddOn = addOn.split(",").map(t => t.trim());
//     }
    
//     let Facilities = facilities
//     if (typeof facilities === "string") {
//         Facilities = facilities.split(",").map(t => t.trim());
//     }

//     const subplan = await Subplan.create({name, adultPrice, childPrice, adultActivity : AdultActivity, 
//         childActivity : ChildActivity, addOn: AddOn, facilities: Facilities, original_adult_price, 
//         original_child_price})

//     subplanResponse = subplan.toObject();
    
//     return res
//     .status(201)
//     .json (new ApiResponse(201, subplanResponse, MESSAGE_TEMPLATES.CREATE_SUCCESS("Sub Plan") ))
    
// })



// // ------------------------------- createEvent --------------------------------------------

// const createEvent = asyncHandler(async(req,res) => {
//     const {  title, shortDescription,  fullDescription, image, 
//         map, priceAdult,  priceChild, date, 
//         time, location,  venue, tags, 
//         seatsAvailable,duration,  language,rating, 
//         terms} = req.body;
//     const Title = await Event.findOne({title});
//     if(Title) throw new ApiError(409, MESSAGE_TEMPLATES.ALREADY_EXISTS("Event"))

//     // If tags is a string → convert to array
//     let Tags = tags
//     if (typeof tags === "string") {
//         Tags = tags.split(",").map(t => t.trim());
//     }

//     let Images = image
//     if (typeof image === "string") {
//         Images = image.split(",").map(t => t.trim());
//     }
    

//     const event = await Event.create({
//         title, shortDescription,  fullDescription, image:Images, 
//         map, priceAdult,  priceChild, date, 
//         time, location,  venue, tags:Tags, 
//         seatsAvailable,duration,  language,rating, 
//         terms
//     });

//     const eventResponse = event.toObject();

//     return res.
//     status(201)
//     .json(new ApiResponse(201, eventResponse, MESSAGE_TEMPLATES.CREATE_SUCCESS("Event")))
// })

// module.exports ={ createEvent, createSubplan}








