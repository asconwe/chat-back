// Modules
const passport = require('passport');
const localSignupStrategy = require('./passport/signup');
const { validateSignupForm } = require('./passport/validate-signup');
const sendSignupConfirmation = require('../utils/sendSignupConfirmation');
const LOCAL_SIGNUP = 'local-signup'

passport.use(LOCAL_SIGNUP, localSignupStrategy);

module.exports = (app) => {
    app.post('/auth/signup', (req, res, next) => {
        const validationResult = validateSignupForm(req.body);
        // Validation failed
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                errors: validationResult.errors
            });
        }

        const authenticateLocalSignup = passport.authenticate(LOCAL_SIGNUP, (err, user, info) => {
            if (err) {

                // Failed due to conflict
                if (err.code === 11000) {
                    // the 11000 Mongo code is for a duplication email error
                    // the 409 HTTP status code is for conflict error
                    return res.status(409).json({
                        success: false,
                        errors: {
                            email: 'This email address is already in use.'
                        }
                    });
                }

                // Failed for other reasons
                console.error(err);
                return res.status(400).json({
                    success: false,
                    errors: {
                        other: 'Could not process the form.'
                    }
                });
            }

            // Here we should send a verification email 
            return sendSignupConfirmation({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, user: user._id.toString()})
                .then((email) => {
                    return res.status(200).json({
                        success: true,
                        message: `You have successfully signed up! Now, you just need to verify your email address. Check ${email}`,
                    });
                })
                .catch(err => {
                    console.error(err);
                    if (err.type = 'email') {
                        return res.status(202).json({
                            success: false,
                            errors: {
                                validation: 'There was an error sending the validation email - we will try again shortly.',
                            }
                        })    
                    }
                    return res.status(400).json({
                        success: false,
                        errors: {
                            other: 'Could not process the form.'
                        }
                    })
                })
        })
        return authenticateLocalSignup(req, res, next);
    });
}
