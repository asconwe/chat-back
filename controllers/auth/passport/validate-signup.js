'use strict'

const EMAIL_ERROR = 'Please provide a valid email address.';
const PASSWORD_ERROR = 'Password must be at least 8 characters long.';

function validateSignupPassword(password) {
    return (typeof password === 'string' && password.trim().length > 7)
}

function validateSignupEmail(email) {
    return (
        typeof email === 'string' && 
        email.trim().length > 5 && 
        email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    );
}

function validateSignupForm(payload) {
    const payloadIsPresent = payload && true;
    const emailIsValid = validateSignupEmail(payload.email);
    const passwordIsValid = validateSignupPassword(payload.password);
    const success = payloadIsPresent && emailIsValid && passwordIsValid;
    const errors = {
        email: !emailIsValid && EMAIL_ERROR,
        password: !passwordIsValid && PASSWORD_ERROR
    }

    return {
        success,
        errors: !success && errors
    };
}

module.exports = {
    validateSignupForm,
    validateSignupEmail,
    validateSignupPassword
};

