const transactionModel = require("../models/transaction");
const ledgerModel = require("../models/ledger.model");
const emailservice = require("../services/email.services");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");


/**
 * Create a new transaction
 */
async function createTransaction(req, res) {

    const {
        FromAccount,
        toAccount,
        amount,
        idempotencyKey
    } = req.body;

}


/**
 * Create initial funds transaction
 */
async function createFundTransaction(req, res) {

    const {
        toAccount,
        amount,
        idempotencyKey
    } = req.body;


    // 1. Validate request
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        });
    }


    // 2. Find receiver account
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    });

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        });
    }


    // 3. Find system user's account
    const fromUserAccount = await accountModel.findOne({
        SystemUser: true,
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        });
    }


    // 4. Start MongoDB transaction
    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        // 5. Create transaction
        const newTransaction = await transactionModel.create(
            [{
                FromAccount: fromUserAccount._id,
                toAccount: toUserAccount._id,
                amount,
                idempotencyKey,
                status: "PENDING"
            }],
            { session }
        );


        const createdTransaction = newTransaction[0];


        // 6. Create DEBIT ledger entry
        await ledgerModel.create(
            [{
                account: fromUserAccount._id,
                amount: amount,
                transaction: createdTransaction._id,
                type: "DEBIT"
            }],
            { session }
        );


        // 7. Create CREDIT ledger entry
        await ledgerModel.create(
            [{
                account: toUserAccount._id,
                amount: amount,
                transaction: createdTransaction._id,
                type: "CREDIT"
            }],
            { session }
        );


        // 8. Mark transaction completed
        createdTransaction.status = "COMPLETED";
        await createdTransaction.save({ session });


        // 9. Commit transaction
        await session.commitTransaction();


        // 10. End session
        session.endSession();


        return res.status(201).json({
            message: "Funds transaction created successfully",
            transaction: createdTransaction
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error(error);

        return res.status(500).json({
            message: "Transaction failed",
            error: error.message
        });
    }
}


module.exports = {
    createTransaction,
    createFundTransaction
};