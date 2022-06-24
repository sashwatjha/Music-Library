var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

router.post('/register',  function(req,res,next){
  var user = new User({
    xid: Math.floor((Math.random() * 99999) + 1),
    email: req.body.email,
    username: req.body.username,
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });

  let promise = user.save();

  promise.then(function(doc){
    return res.status(201).json(doc);
  })

  promise.catch(function(err){
    return res.status(501).json({message: 'Error registering user.'})
  })
})

router.post('/login', function(req,res,next){
  let promise = User.findOne({username:req.body.username}).exec();

  promise.then(function(doc){
   if(doc) {
     if(doc.isValid(req.body.password)){
         // generate token
         let token = jwt.sign({username:doc.username, email:doc.email, xid:doc.xid},'secret', {expiresIn : '3h'});

         return res.status(200).json(token);

     } else {
        return res.status(501).json({message:'Invalid Credentials'});
     }
   }
   else {
      console.log("User is not registered");
      return res.status(501).json({message:'User is not registered.'})
   }
  });

  promise.catch(function(err){
    return res.status(501).json({message:'Some internal error'});
  })
})

router.get('/username', verifyToken, function(req,res,next){
 return res.status(200).json(decodedToken.username);
})

router.get('/email', verifyToken, function(req,res,next){
  return res.status(200).json(decodedToken.email);
 })

 router.get('/xid', verifyToken, function(req,res,next){
  return res.status(200).json(decodedToken.xid);
 })

var decodedToken='';

function verifyToken(req,res,next){
 let token = req.query.token;

 jwt.verify(token,'secret', function(err, tokendata){
   if(err){
     return res.status(400).json({message:'Unauthorized request'});
   }
   if(tokendata){
     decodedToken = tokendata;
     next();
   }
 })
}

module.exports = router;
