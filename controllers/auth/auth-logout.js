module.exports = (app) => {
    app.get('/auth/logout', (req, res) => {
        req.logout();
        if (req.isAuthenticated()) {
            return res.status(400).json({ success: false, errors: { logout: 'Logout failure'} })
        }
        return res.status(200).json({ success: true })
    });
}