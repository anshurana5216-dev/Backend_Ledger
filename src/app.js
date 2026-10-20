const express = require("express");

const cookieparser = require("cookie-parser")



const app = express();

app.use(express.json())
app.use(cookieparser())



/**
 * - Routes requireds
 */

const authRouter = require("./routes/auth.routes")
const accountRouter = require('./routes/account.routes')
const transactionRoutes = require("./routes/transaction.routes")


/**
 * - use routes
 */

app.use("/api/auth" , authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transaction" ,  transactionRoutes)



module.exports = app