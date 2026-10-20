const { Router } = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();

/**
 * - POST /api/transaction/
 * - Creating a new transaction
 */

transactionRouter.post(
    "/",
    authmiddleware.authmiddleware
);


/**
 * - POST /api/transaction/system/initial-funds
 * - Create initial funds transaction from system user
 */

transactionRouter.post(
    "/system/initial-funds",
    authmiddleware.authSystemUsermiddleware,
    transactionController.createFundTransaction
);

module.exports = transactionRouter;