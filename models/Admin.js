const mongoose = require('mongoose')

const { siteSchema } = require('./Site');

const adminSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    sites: [mongoose.Schema.ObjectId]
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
    Admin,
    adminSchema
}