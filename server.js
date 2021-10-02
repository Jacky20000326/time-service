const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require('body-parser');
const AuthRoute = require("./routes/index").Auth
const store = require("./routes/index").store
const interactive = require("./routes/index").interactive
const authentication =  require("./config/passport")
const auth = require("./config/passport")



// connect cosmos db
mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
  auth: {
    user: process.env.COSMOSDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  },
useNewUrlParser: true,
useUnifiedTopology: true,
retryWrites: false
})
.then(() => console.log('Connection to CosmosDB successful'))
.catch((err) => console.error(err));


// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/api/auth",AuthRoute)
app.use("/api/interactive",interactive)
app.use("/api/store",store)
app.use('/',auth)
app.use('/api/passport',authentication)



app.listen(3002,()=>{
    console.log("It's port 3002");
})