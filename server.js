require("dotenv").config();

const express = require("express");
const app = require("./src/app");
const connectdb = require("./src/DB/db");
const authRouter = require("./src/routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

connectdb();

app.listen(3000, () => {
    console.log("server is running on port 3000");
});