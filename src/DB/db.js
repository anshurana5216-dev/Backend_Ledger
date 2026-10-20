const mongoose = require("mongoose");

const dns = require("dns");


dns.setServers([
     "8.8.8.8",
    "1.1.1.1"
])


function connecteddb(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connected to db")
    }
    )

    .catch(err=>{
        console.log("error conecting to db")
        process.exit(1);
    })
}

module.exports = connecteddb;