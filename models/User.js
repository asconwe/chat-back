const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type : String , unique : true, required : true, dropDups: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true },
    sites: [mongoose.Schema.Types.ObjectId]
})

// On login attempt: compare given password to password hash
userSchema.methods.validatePassword = function compauserassword(password, callback) {
    bcrypt.compare(password, this.password).then(callback)
};

// Saving a new password or updating a password
userSchema.pre('save', function saveHook(next) {
    const user = this;

    // proceed further only if the password is modified or the user is new
    if (!user.isModified('password')) return next();


    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            // replace a password string with hash value
            user.password = hash;

            return next();
        });
    });
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    userSchema
}