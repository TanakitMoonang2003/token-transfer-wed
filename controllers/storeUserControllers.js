const User = require('../models/User');

module.exports = (req, res) => {
    User.create(req.body).then((user) => {
        console.log('User registered successfully!');
        
        
        req.session.userId = user._id; 
        
        res.redirect('/home1'); 
    }).catch((error) => {
        if (error){
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body)
            return res.redirect('/register');
        }
    })
}