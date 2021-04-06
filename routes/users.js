const express = require('express');
var router = express.Router();
const {User} = require('../lib/models');
const bcrypt = require('bcrypt');


/* GET users listing. */
router.post('/login/',express.json(), async function(req, res, next) {
  let user = await User.findOne({where: {username: req.body.username}});
  if(user !== null)
  {
    let userValid = await CheckHashPassword(user.password,req.body.password);
    if (userValid)
    {
      res.json(user);
    }
    else
    {    
      res.send(JSON.stringify({message:'PasswordIncorrect'}))
    }
  }
  else
  {
    res.send(JSON.stringify({message:'NotFound'}))
  }
});

/* Post Users. */
router.post('/create/',express.json(), async function(req, res, next) {
  let hash = await hashPassword(req.body.password);
  req.body.password = hash;
  // check if user already exists 
  let user = await User.findOne({where: {username: req.body.username}});
  if(user === null)
  {
    let user = await User.create(req.body);
    res.json(user);
  }
  else
  {
    res.send(JSON.stringify({message:'Exists'}))
  }
});




async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  //console.log(hash)
  return hash;
}

async function CheckHashPassword(hash, password2) { 
  // const salt = await bcrypt.genSalt(10)
  // const hash = await bcrypt.hash(password, salt)
  const isSame = await bcrypt.compare(password2, hash) 
  return isSame;
}



module.exports = router;
