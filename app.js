require('dotenv').config();
const express = require('express') 
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

//using passport
const session  = require('express-session')
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
// const passportLocal = require('passport-local')      not need to  require passport-local

// const encrypt = require('mongoose-encryption')       //bcz we are going to use Hash(md5)
const md5 = require('md5')
const ejs = require('ejs')
const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
  secret:"Our little secret",
  resave: false,
  saveUninitialized:false  

}))
app.use(passport.initialize());
app.use(passport.session());

 
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email : String,
  password : String 
});

userSchema.plugin(passportLocalMongoose)

// userSchema.plugin(encrypt, { secret :process.env.SECRET, encryptedFields:["password"]});  //bcz we are going to use Hash(md5)


const User = new mongoose.model("User", userSchema)
€
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.get('/', (req, res) => {
  res.render('home')
})


app.get('/login', (req, res) => {
    res.render('login')
  })

  
app.get('/register', (req, res) => {
    res.render('register')
  })

app.post('/register', (req,res)=>{
  const newUser = new User({
    // email : req.body.username,
    // password: req.body.password
    email : req.body.username,
    password: md5(req.body.password)
  })
  newUser.save()
  .then(savedUser => {
    res.render('secrets')
  })
  .catch(error => {
    console.error(error);
})
});
A


app.post('/login', (req,res)=>{
  const username = req.body.username;
  const password = md5(req.body.password);


  User.findOne({email:username})
  .then((foundUser=>{
    if(foundUser.password === password){
      res.render('secrets')
    }
    else{res.send("<h1>Enter correct Email and Password.</h1><br>Please register before login")}
  }))
  .catch(err => res.render("There occurred some error"+ err))
  });

app.listen('3000', ()=>{console.log("Server started on port 3000")} );