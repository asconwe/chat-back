'use strict'

const EMAIL_ERROR = 'An email is required to sign in.';
const PASSWORD_ERROR = 'A password is required to sign in.';

function validateStringIsPresent(str) {
    return typeof str === 'string' && str.trim().length >= 0
}

const validateLoginEmail = validateStringIsPresent;
const validateLoginPassword = validateStringIsPresent;

function validateLoginForm(payload) {
    const payloadIsPresent = payload && true;
    const emailIsValid = validateLoginEmail(payload.email);
    const passwordIsValid = validateLoginPassword(payload.password);
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
    validateLoginEmail,
    validateLoginPassword,
    validateLoginForm
};