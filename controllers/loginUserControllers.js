const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req, res) =>  {
    const {username, email, password} = req.body

  
    User.findOne({email: email}).then((user) => {
        console.log(user)

        if (user) {
            bcrypt.compare(password, user.password).then((match) => {
              if (match) {
                req.session.userId = user._id;
                res.redirect('/home1'); 
              } else {
                res.redirect('/login'); 
              }
            }).catch(err => {
              console.error(err);
              res.redirect('/login'); 
            });
          } else {
            res.redirect('/login'); 
          }
    })
}