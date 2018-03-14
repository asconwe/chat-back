const passport = require('passport');
const LocalLoginStrategy = require('./passport/login');
const { validateLoginForm } = require('./passport/validate-login');

const { User } = require('../../models/User');

const LOCAL_LOGIN = 'local-login';

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(LOCAL_LOGIN, LocalLoginStrategy);

module.exports = (app) => {
    app.post('/auth/login', (req, res, next) => {
        const validationResult = validateLoginForm(req.body);

        // Validation failed
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                errors: validationResult.errors
            });
        }
        
        const authenticateWithLocalStrategy = passport.authenticate(LOCAL_LOGIN, {session: true}, (err, user, message) => {
            // Authentication failed
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: {
                        authentication: message
                    }
                });
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: { 
                        authentication: message
                    }
                });
            }

            // Authentication successful
            req.login(user, {}, () => {
                return res.status(200).json({
                    success: true,
                    message: 'You are logged in!'
                });
            });
        })
        return authenticateWithLocalStrategy(req, res, next);
    });
};

