const mongoose = require("mongoose");


const ledgerSchema = new mongoose.Schema({
    account : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required : [true , "ledger must be associated with an account"],
        index : true, 
        immutable: true
    },

    amount : {
        type: Number,
        required : [true , "amount is required for creating a ledger entry"],
        immutable : true
    },

    transaction : {
        type: mongoose.Schema.Types.ObjectId,
        ref:  " transaction" , 
        required : [true , "ledger ,must be associated with a transaction"],
        index: true , 
        immutable : true
    },

    // transaction: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : "transaction" , 
    //     required: [true , "ledger must be associated with a transaction"],
    //     index : true,
    //     immutable: true
    // },
    type: {
        type: String,
        enum: {
            values : ["CREDIT " , "DEBIT"],
            message : "type can be either CREDIT or DEBIT",

        },
        required: [true , "ledger type is required"],
        immutable: true
    }

})

function preventledgermodification(){
    throw new error("ledger entries are immutable and cannot be modifed or deleted");

}


ledgerSchema.pre('findOneAndUpdate' , preventledgermodification);

ledgerSchema.pre('updateOne' , preventledgermodification);

ledgerSchema.pre('deleteOne' , preventledgermodification);

ledgerSchema.pre('remove' , preventledgermodification);

ledgerSchema.pre('delteMany' , preventledgermodification);


const ledgerModel = mongoose.model("ledger" , ledgerSchema);
module.exports = ledgerModel