const Admin = require('../Models/adminModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { expressjwt: expressJwt } = require('express-jwt')

//SIGN UP
exports.signup = (req, res) => {
  console.log(req.body);
  let adminList = process.env.adminList.split(',')
  if(adminList.includes(req.body.email)) {
    req.body.role = 1
  }
  const admin = new Admin(req.body)
  admin.save((err, admin) => {
    if(err || !admin) return res.status(400).json({ signUpSuccess: false, message: 'something went wrong, please try again'})

    res.status(200).json({ signUpSuccess: true, message: admin})
  })
}

//SIGN IN
exports.signin = (req, res) => {
  const { email, password} = req.body
  Admin.findOne({ email: email}).exec((err,admin) => {
    if(err || !admin) return res.status(400).json({ signInSuccess: false, message: 'An account with this email does not exist'})

    if(!admin.authentication(password)) return res.status(400).json({ signInSuccess: false, message: 'login cretencial'})

    const token = jwt.sign({ _id: admin._id }, process.env.SECRET)
    res.cookie('token1', token, {expire: new Date() + 9999})
    res.status(200).json({ signInSuccess: true, message: {admin, token}})
  })
}

exports.isRequiredSignIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
  algorithms: ['HS256'],
})

exports.isAuth = (req, res, next) => {
  let userIsAuth= req.profile && req.auth && req.profile._id == req.auth._id
  if(!userIsAuth) return res.status(400).json({ error: 'please sign in first'})

  next();
}

exports.adminById = (req, res, next, id) => {
  console.log(id);
  Admin.findById(id).exec((err, result) => {
    if( err | !result) return res.status(400).json({ error: 'no user with this id'})

    req.profile = result
    next();
  })
}

exports.signOut = (req, res) => {
  res.clearCookie('token1')
  res.status(200).json({ message: 'signOut completed'})
}