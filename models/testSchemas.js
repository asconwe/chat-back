const { Site } = require('./Site');
const { Admin } = require('./Admin')

module.exports = () => {
    
    const augustConwellPortfolio = new Site({
        name: 'August Conwell - Portfolio',
        address: 'http://augustconwell.com',
    })
    
    
    
    return augustConwellPortfolio.save()
    .then((savedSite) => {
        console.log('==============================Success=================================')
        console.log(savedSite);
        
        const augustAdmin = new Admin({
            name: 'August Conwell',
            email: 'asconwell@hotmail.com',
            passwordHash: 'asdf890n43pfe98',
        })
        
        augustAdmin.sites.push(savedSite._id);
        
        return augustAdmin.save()
    })
    .then((savedAdmin) => {
        console.log('==============================Success=================================')
        console.log(savedAdmin);
    })
    .catch(err => console.error(err))

}