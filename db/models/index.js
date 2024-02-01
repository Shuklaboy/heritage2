const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const env = require("dotenv").config()

mongoose.connect(`${process.env.MONGO}`)
.then((res)=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log(err);
});

 const Months = new mongoose.Schema({
    id: Number,
    name: String,
    image: String
})
const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    role: String
})
const Month = mongoose.model("month", Months)
adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("AdminUser", adminSchema);
 passport.use(Admin.createStrategy({ passReqToCallback: true }));
 passport.use(Admin.createStrategy());
 passport.serializeUser((user, done) => {
     done(null, user);
 });
 
 passport.deserializeUser((user, done) => {
     done(null, user);
 });
module.exports= {
    Month,
    Admin
}