var express = require('express');
var router = express.Router();
const {User} = require('../models/index');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.post('/', async function(req, res, next) {
  const userData = req.body;
  const newUser = new User(userData);
  try {
    await newUser.save();
    console.log(JSON.stringify(userData));
    // TODO: save to database
    res.status(201).json({
      success: true,
      message: 'User saved successfully.',
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save user data.'
    });
  }

})

router.get('/', async function(req, res, next) {
  // TODO fetch from database
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully.',
    users: users
  });
})


module.exports = router;
