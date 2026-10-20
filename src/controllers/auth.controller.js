const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailServices = require('../services/email.services')
const tokenblicklistModel = require("../models/tokenblacklist.model")



 //user register controller 
 //post / api/auth/register

 async function userRegisterController(req, res) {

    const { email, password, name } = req.body;

    // Check required fields
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Name, email and password are required",
            status: "failed"
        });
    }

    // Check if user already exists
    const isExist = await userModel.findOne({
        email: email
    });

    if (isExist) {
        return res.status(422).json({
            message: "User already exists with email",
            status: "failed"
        });
    }

    // Create user
    const user = await userModel.create({
        email,
        password,
        name
    });

    // Create JWT
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECREAT,
        {
            expiresIn: "3d"
        }
    );

    // Set cookie
    res.cookie("token", token);

    // Send registration email
    await emailServices.sendRegistrationEmail(
        user.email,
        user.name
    );

    return res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}




/**
 * - user login controller
 * - post - /api/auth/login
 */


async function userLoginCintroller(req , res){
    const {email , password} = req.body


    const user  = await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(401).json({
            message : "email or password is INVALID"
        })
    }

     const isValidPassword = await user.comparePassword(password)
    

     if(!isValidPassword){
          return res.status(401).json({
            message : "email or password is INVALID"
          })
     }

    const token = jwt.sign({userId: user._id} , process.env.JWT_SECREAT , {
        expiresIn: "3d"
    })

    res.cookie("token" , token)

    res.status(200).json({
        user: {
            _id: user._id,
            email:user.email,
            name: user.name
        }, 
        token
    })


    await emailServices.sendRegistrationEmail(user.email, user.name)


}




async function userLogoutController(req , res){

    const token = req.cookie.token || req.headers.authorization?.split(" ")[1]

    if(!token){
      

     return res.status(200).json({
        message : "User logged out successfully"
    })
}

res.cookie("token" , "")
await tokenblicklistModel.create({
    token: token
})

res.status(200).json({
    message : "User logged out successfully"
})
module.exports = {userRegisterController , userLoginCintroller , userLogoutController}