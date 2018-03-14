const mongoose = require('mongoose')

const { Site } = require('../../models/Site');
const sendInvitation = require('../utils/sendInvitation');
// const validateEmail = require('./auth')


module.exports = (app) => {
  app.post('/api/invitation/:site_id', (req, res) => {
    const { site_id } = req.params;
    const { email, firstName, lastName } = req.body;
    const reqSiteId = mongoose.Types.ObjectId(site_id);
    // Authentication
    if (!req.user) return res.status(404).json({ error: 'Authentication required'});
    if (!req.user.sites.find((site) =>  site.equals(reqSiteId))) {
      return res.status(404).json({ error: `You don't own that site`});
    }

    // const { isValid, validationMessage, validationError } = validate({email, firstName, lastName})
    // if (!isValid) return res.status(400).json({ validationError, validationMessage })

    const invitation = {
      email,
      firstName,
      lastName
    }

    return Site.findById(reqSiteId)
      .populate('reps')
      .then((siteToUpdate) => {
        if (!siteToUpdate) {
          return res.status(400).json({
            err: 'invalid site_id',
            message: `There is no matching site - double check the url.`
          })
        }

        const duplicate = siteToUpdate.reps && siteToUpdate.reps.find((user) => user.email === email)
        if (duplicate) {
          return res.status(409).json({
            error: 'duplicate record',
            message: 'There is already an active account under that email address'
          })
        }


        siteToUpdate.invitations.push(invitation);
        return sendInvitation(site_id.toString(), siteToUpdate.name, email, firstName, siteToUpdate);
      })
      .then((siteToUpdate) => {
        return siteToUpdate.save()
      })
      .then(() => res.status(200).json({ success: true }))
      .catch((err) => {
        console.log(err)
        // TODO Need to filter error here
        return res.status(400).json({ error: err })
      })
  })
}