// Modules
const passport = require('passport');
const localSignupStrategy = require('./passport/signup');
const validateSignupForm = require('./passport/validate-signup');
const LOCAL_SIGNUP = 'local-signup'

passport.use(LOCAL_SIGNUP, localSignupStrategy);

module.exports = (app) => {
    app.post('/auth/signup', (req, res, next) => {
        const validationResult = validateSignupForm(req.body);
        
        // Validation failed
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
        }
        
        return passport.authenticate(LOCAL_SIGNUP, (err, user, info) => {
            if (err) {

                // Failed due to conflict
                if (err.name === 'MongoError' && err.code === 11000) {
                    // the 11000 Mongo code is for a duplication email error
                    // the 409 HTTP status code is for conflict error
                    return res.status(409).json({
                        success: false,
                        message: 'Check the form for errors.',
                        errors: {
                            email: 'This email address is already in use.'
                        }
                    });
                }
                
                // Failed for other reasons
                console.error(err);
                return res.status(400).json({
                    success: false,
                    message: 'Could not process the form.'
                });
            } 
            
            // Here we should send a verification email 
            return res.status(200).json({
                success: true,
                message: 'You have successfully signed up! Verify your email.',
                verificationSent: true,
            });
        })(req, res, next);
    });
}
