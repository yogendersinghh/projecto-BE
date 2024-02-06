require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
const cors  = require("cors")
const docsRoute = require("./routes/docs")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")


const authenticate = require("./middleware/authenticate");

mongoose
  .connect("mongodb+srv://YogenderSingh:yogi123@cluster0.v02sl.mongodb.net/serverless", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connected");
  })
  .catch(() => {
    console.log("error in connection of mongodb");
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
app.use(
    authenticate.unless({
      path: ["/auth/login", "/auth/signup"],
    })
  );
  
app.use("/auth",authRoute)
app.use("/user",userRoute)
app.use("/docs",docsRoute)

app.listen(3003,
  ()=>{
    console.log("connection")
})