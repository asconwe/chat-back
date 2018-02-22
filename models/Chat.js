const mongoose = require('mongoose')

const { adminSchema } = require('./Admin');

const chatSchema = mongoose.Schema({
    endUserName: String,
    admin: [mongoose.Schema.ObjectId],
    messages: [{ author: String, date: Date, message: String }]
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = {
    Chat,
    chatSchema
}