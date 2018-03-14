const mongoose = require('mongoose');
const { Site } = require('../../models/Site')
const { User } = require('../../models/User')

module.exports = (app) => {
  app.post('/api/sites/', (req, res) => {
    if (!req.user) return res.status(404).json({ 
      success: false,
      error: { authentication: 'Authentication required.' } 
    });

    const { name, address } = req.body;

    // const validationResult = validateSiteRequest
    // if (!validationResult.success) return res.status(400).json({ 
    //   success: false,
    //   error: validationResult.error
    // })

    const newSite = new Site({
      name,
      address,
      reps: [req.user._id],
      admins: [req.user._id]
    })
    req.user.sites.push(newSite._id);
    return req.user.save()
      .then(() => {
        return newSite.save()
      })
      .then(savedSite => {
        return res.status(200).json({
          success: true,
          message: 'New site created',
          site_id: savedSite._id.toString()
        })
      })
      .catch(err => {
        console.log(err);
        return res.status(400).json(err);
      })
  })
}