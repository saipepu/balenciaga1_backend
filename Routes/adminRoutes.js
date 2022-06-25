const express = require('express');
const { signup, signin, isAuth, isRequiredSignIn, adminById, signOut } = require('../Controller/adminController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Basic Admin Routes')
})

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/authRoute/:adminById', isRequiredSignIn, isAuth, (req, res) => {
  console.log(req)
  res.send('hello you are authed')
})
router.get('/signout', signOut)
router.param('adminById', adminById)

module.exports = router;