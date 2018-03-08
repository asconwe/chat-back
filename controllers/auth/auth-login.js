const passport = require('passport');
const LocalLoginStrategy = require('./passport/login');
const validateLoginForm = require('./passport/validate-login');

const {Rep} = require('../../models/Rep');

const LOCAL_LOGIN = 'local-login';

passport.serializeUser(function (rep, done) {
    done(null, rep._id);
});

passport.deserializeUser(function (id, done) {
    Rep.findById(id, function (err, rep) {
        done(err, rep);
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
                message: validationResult.message,
                errors: validationResult.errors
            });
        }
        const authenticateWithLocalStrategy =  passport.authenticate(LOCAL_LOGIN, (err, rep) => {
            // Authentication failed
            if (err) {
                return res.status(409).json({
                    success: false,
                    message: 'There was an issue accessing the database, please try again later'
                });
            }
            if (!rep) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password did not match an account in our database'
                });
            }

            // Authentication successful
            req.login(rep, {}, (data) => {
                return res.status(200).json({
                    success: true,
                    message: 'You are logged in'
                });
            });
        })
        return authenticateWithLocalStrategy(req, res, next);
    });
};

