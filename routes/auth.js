const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/register',(req,res)=> res.render('register'));
router.post('/register', async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        const hash = await bcrypt.hash(password,10);
        await User.create({username,email,password:hash});
        res.redirect('/login');
    }catch(err){
        res.send("Registration error");
    }
});

router.get('/login',(req,res)=> res.render('login'));
router.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(!user) return res.send("Invalid credentials");
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.send("Invalid credentials");
    req.session.user = { id:user._id, username:user.username, email:user.email };
    res.redirect('/dashboard');
});

router.get('/logout',(req,res)=>{
 req.session.reset();
 res.redirect('/login');
});

module.exports = router;
