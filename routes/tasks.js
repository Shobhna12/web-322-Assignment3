const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

function auth(req,res,next){
 if(!req.session.user) return res.redirect('/login');
 next();
}

router.get('/dashboard',auth,(req,res)=> res.render('dashboard',{user:req.session.user}));

router.get('/tasks',auth, async (req,res)=>{
 const tasks = await Task.findAll({ where:{ userId:req.session.user.id }});
 res.render('tasks',{tasks});
});

router.get('/tasks/add',auth,(req,res)=> res.render('addTask'));

router.post('/tasks/add',auth, async (req,res)=>{
 await Task.create({...req.body, userId:req.session.user.id});
 res.redirect('/tasks');
});

router.get('/tasks/edit/:id',auth, async (req,res)=>{
 const task = await Task.findByPk(req.params.id);
 res.render('editTask',{task});
});

router.post('/tasks/edit/:id',auth, async (req,res)=>{
 const task = await Task.findByPk(req.params.id);
 await task.update(req.body);
 res.redirect('/tasks');
});

router.post('/tasks/delete/:id',auth, async (req,res)=>{
 const task = await Task.findByPk(req.params.id);
 await task.destroy();
 res.redirect('/tasks');
});

router.post('/tasks/status/:id',auth, async (req,res)=>{
 const task = await Task.findByPk(req.params.id);
 const newStatus = task.status === 'pending' ? 'completed':'pending';
 await task.update({status:newStatus});
 res.redirect('/tasks');
});

module.exports = router;
