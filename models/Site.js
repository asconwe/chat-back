const mongoose = require('mongoose');

const { chatSchema } = require('./Chat');
const { adminSchema } = require('./Admin');

const siteSchema = mongoose.Schema({
    name: String,
    address: String,
    chats: [mongoose.Schema.ObjectId],
    admins: [mongoose.Schema.ObjectId]
})

const Site = mongoose.model('Site', siteSchema);

module.exports = {
    Site,
    siteSchema
}