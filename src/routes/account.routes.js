const express = require("express");
const { authmiddleware } = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.post(
    "/",
    authmiddleware,
    accountController.CreateAccountController
);




/**
 * - get / api/accounts/
 * -get accunt of the logged-in user
 * -protected
 * 
 */

router.get("/", authmiddleware.authmiddleware , accountController.getUserAccountController)

module.exports = router;




/**
 * - get / api/accounts/balance/accountId
 * -get balance of the logged-in user
 * -protected   
 */

router.get("/balance/:accountId" , authmiddleware.authmiddleware , accountController.getAccountBalanceController)




/**
 * POST /api/accounts
 * Create a new account
 * Protected route
 */