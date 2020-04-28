var express = require('express')
var app = express()
var bcrypt = require('bcryptjs')
var http = require('http')
var fs = require('fs')
var path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

//const User = require("/model/User.js");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))


const MONGOURI = "mongodb+srv://dpark:joey1234@cluster0-p65ai.mongodb.net/test?retryWrites=true&w=majority";

const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const { User } = require('./model/user')
app.use(bodyParser.json());

var users = []

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, '/views/home.html'))
})

app.get('/register', function(req,res) {
    res.sendFile(path.join(__dirname, '/views/register.html'))
})

app.get('/login', function(req,res) {
    res.sendFile(path.join(__dirname, '/views/login.html'))
})


app.get('/users', function(req,res) {
    res.json(users)
})

app.post('/users/signup', async function(req, res){
    // try {
    //     var hashedPassword = await bcrypt.hash(req.body.password, 10)
    //     var user = {name: req.body.name, password: hashedPassword}
    //     users.push(user)
    //     res.status(211).send()
    // } catch {
    //     res.status(500).send()
    // }

    const user = new User({
        username: req.body.username,
        password: req.body.password
    }).save((err, response)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(response)
    })

})

app.post('/users/login', async function(req, res){
    // console.log(req.body)
    // const user = users.find(user => user.name === req.body.name)
    // console.log(user)
    // if (user == null) {
    //     res.statusCode = 400
    //     return res.send("invalid")
    // }
    // try {
    //     if(await bcrypt.compare(req.body.password, user.password)){
    //         res.send("success")
    //     } else {
    //         res.send("failed")
    //     }
    // } catch {
    //     res.status(500).send()
    // }

    User.findOne({'username': req.body.username}, (err, user)=> {
        if(!user) return res.json({message:'Login failed, user not found'})
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message: 'Wrong Password'
            });
            res.status(200).send('Logged in successfully')
        })
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    console.log('Server Started at PORT ' + PORT);
  });