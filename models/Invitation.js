const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
})

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = {
    Invitation,
    invitationSchema
}