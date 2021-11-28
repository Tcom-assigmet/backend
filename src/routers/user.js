const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

router.post("/register", async (req, res) => {
    
  
  
   //checking user alredy invalid
  
   const emailExists=await User.findOne({ email: req.body.email});
   if(emailExists)return res.status(400).send('Email already exists');
  
   //hash the password
   const salt=await bcrypt.genSalt(10);
   const hashPassword=await bcrypt.hash(req.body.password,salt);
  
    //create new userne
  
    const Data={
      name: req.body.name,
     
        email: req.body.email,
       password: hashPassword,
       age: req.body.age,
    }
  
    User.create(Data).then(function(User){
      res.send({userId:User._id,message:"registration success"});
  }).catch();
  
    
    
  });



   
  
   


router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not registered');
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');
    
    //create and assign a token
    const token = jwt.sign({ _id: user._id }," process.env.TOKEN_SECREThfjhfjhjfhjhfhwefhej");
   //send responese in try catch
    try {
        res.header('auth-token', token).send(token);
        }
    catch (err) {
        res.status(500).send(err);
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router