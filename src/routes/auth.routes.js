const express = require("express")
const authcontroller = require("../controllers/auth.controller")

const router = express.Router()


// user register controller
// POST - /api/auth/register
router.post("/register" , authcontroller.userRegisterController)


//POST - /api/aiuth/login
router.post("/login" , authcontroller.userLoginCintroller)


/**
 * - POST / api/auth/logout
 * -logout user
 * -protected
 */
router.post("/logout" , authcontroller.userLogoutController)
 
module.exports = router