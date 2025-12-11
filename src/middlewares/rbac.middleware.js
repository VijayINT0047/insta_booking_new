const { MESSAGE_TEMPLATES } = require("../constant/constant");
const { ApiError } = require("../utils/apiHelper");

function allowRoles(...roles) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;
    // if (!userRole) return res.status(403).json({ message: 'Forbidden' });
    if (!userRole) throw new ApiError(403,MESSAGE_TEMPLATES.FORBIDDEN("User Role"))

    if (roles.includes(userRole)) return next();
    // return res.status(403).json({ message: 'Forbidden: insufficient role' });
    throw new ApiError(403, MESSAGE_TEMPLATES.FORBIDDEN("Insufficient role permission"));

    
  };
}

module.exports = { allowRoles };



// How it it used
// const { allowRoles } = require("./middlewares/rbac.middleware");

// app.get("/admin-dashboard",
//     authMiddleware,     // checks token
//     allowRoles("admin"), // checks role
//     dashboardController
// );
