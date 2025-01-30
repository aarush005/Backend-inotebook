const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/api/auth/". Doesn't require auth
router.post('/',[
    body('name').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], (req, res)=>{
    const user = User(req.body);
    user.save()
    res.send(req.body);
})

module.exports =  router 