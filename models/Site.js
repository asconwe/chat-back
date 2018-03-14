const mongoose = require('mongoose');

const { chatSchema } = require('./Chat');
const { UserSchema } = require('./User');
const { invitationSchema } = require('./Invitation');

const siteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
    },
    chats: [chatSchema],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    reps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    invitations: [invitationSchema]
})

const Site = mongoose.model('Site', siteSchema);

module.exports = {
    Site,
    siteSchema
}