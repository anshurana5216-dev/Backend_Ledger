const accountmodel = require("../models/account.model");



async function CreateAccountController(req , res){
    const user = req.user;

    const account = await accountmodel.create({
        user: user._Id
    })

    res.status(201).json({
        account
    })
}


async function getUserAccountController(req , res){
    const accounts = await accountmodel.find({user : req.user._id});

    res.status(200).json({
        accounts
    })
}


async function getAccountBalanceController(req , res){
    const { accountId } = req.params;

    const account = await accountmodel.findOne({
        _id: accountId,
        user: req.user._id
    });

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({
        balance: account.balance
    })
}

const balance = await account.getBalance();

res.status(200).json({
    balance
})


module.exports = {
    CreateAccountController, 
    getUserAccountController,
    getAccountBalanceController
}