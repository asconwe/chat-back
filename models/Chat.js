const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    endUserName: String,
    messages: [{ author: String, date: Date, message: String }]
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = {
    Chat,
    chatSchema
}