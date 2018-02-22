const mongoose = require('mongoose')

const { siteSchema } = require('./Site');

const repSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    sites: [mongoose.Schema.ObjectId]
})

const Rep = mongoose.model('Rep', repSchema);

module.exports = {
    Rep,
    repSchema
}