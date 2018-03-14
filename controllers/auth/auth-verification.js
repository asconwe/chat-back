const mongoose = require('mongoose');
const { User } = require('../../models/User');

module.exports = (app) => {
  app.post('/auth/verification/', (req, res) => {
    return User.findById(mongoose.Types.ObjectId(req.body.user_id))
      .then(user => {
        user.verified = true;
        return user.save()
      })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: 'Your email address has been verified!'
        })
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          error: {
            verification: 'Could not verify email address'
          }
        })
      })
  })
}