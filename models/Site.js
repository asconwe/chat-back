const mongoose = require('mongoose');

const { chatSchema } = require('./Chat');
const { repSchema } = require('./Rep')

const siteSchema = mongoose.Schema({
    name: String,
    address: String,
    chats: [chatSchema],
    admins: [repSchema],
    reps: [repSchema]
})

const Site = mongoose.model('Site', siteSchema);

module.exports = {
    Site,
    siteSchema
}