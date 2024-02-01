const express = require("express");
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = ("mongoose")
const {Month, Admin} = require("./db/models/index")

const session = require("express-session");
const passport = require("passport");



//session
app.use(session({
    secret: 'oEn0xUaQiDiUMZEt pass cluster',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


 function isauth (req, res, next){
    // console.log(req);
    if(!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        next()
    }
}

app.get("/", ((req, res) => {
    res.render('login', { error: "", user: "" });
}))
app.get("/add/images",isauth, ((req, res) => {
    res.render('images', { error: "", user: "" });
}))

app.get("/view",isauth, (req, res)=>{
    Month.find()
    .then((d)=>{
        res.render("view", {error: "", data: d})

    })
    .catch((err)=>{
        res.render("view", {error: "Unable to find any images", data: false})
    })
})

app.get("/all/images", (req, res)=>{
    Month.find()
    .then((d)=>{
        res.json(d)
    })
    .catch((err)=>{
        res.json(err)
    })
})
app.post("/api/login", (req, res, next)=>{
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          // *** Display message without using flash option
          // re-render the login form with a message
          return res.render('login', { error: "Incorrect username or password", user: req.user });
        }
        req.logIn(user, function (err) {
          if (err) { return next(err); }
          // console.log(req.body)
    
          res.redirect("/add/images")
    
        });
      })(req, res, next);
})

app.post("/api/add/images",isauth, (req, res)=>{
    console.log(req.body);
    let month = new Month({
        id: req.body.id,
        name: req.body.name,
        image: req.body.link
    })

    month.save()
    .then((resp)=>{
        res.render("images", {error: "Month is addded"})
    })
    .catch((err)=>{
        console.log(err);
        res.render("images", {error: "Unable to add month"})

    })
})
app.post("/api/delete/:id", isauth, (req, res)=>{
    Month.findOneAndDelete({id: Number(req.params.id)})
    .then((d)=>{
        res.json({Success: true})

    })
    .catch((err)=>{
        console.log(err);
        res.json({url: "/add/images/?err=Unable to delete "})
        // res.redirect("/add/images/?err=Unable to delete ")
    })
})

// app.post("/api/register", (req, res) => {
//     Admin.register({username: req.body.username }, req.body.password, function(err, user){



//         if(err){
//           // console.log(users.username);
//           // console.log(users.email);
//           // req.flash('error', 'No account with that email address exists.');
//           res.status(401);
//           console.log(err);
//           // res.end("A user with same username or email is already registered");
//           const error = "A user with same username or email is already registered Please sign in if you are already registered";

//           res.render("login", {error: error, path: req.route.path, user: req.user});
//           return;
//         }
//         else {
//             passport.authenticate("local")(req, res, function(err, user, info, options){

//             res.redirect("/");

//             });
//         }


//         });
    
// })



const port = process.env.PORT || 3000

app.listen(port, (() => {
    console.info(`Server is running on port ${port}`)
}))