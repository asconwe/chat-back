const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const repSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    sites: [mongoose.Schema.ObjectId],
    isAdminOf: [mongoose.Schema.ObjectId]
})

// On login attempt: compare given password to password hash
repSchema.methods.validatePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password).then(callback)
};

// Saving a new password or updating a password
repSchema.pre('save', function saveHook(next) {
    const rep = this;

    // proceed further only if the password is modified or the rep is new
    if (!rep.isModified('password')) return next();


    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(rep.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            // replace a password string with hash value
            rep.password = hash;

            return next();
        });
    });
});

const Rep = mongoose.model('Rep', repSchema);

module.exports = {
    Rep,
    repSchema
}