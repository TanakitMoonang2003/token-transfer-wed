const User = require('../models/User');


module.exports = async (req, res) => {

    let Userdata = await User.findById(req.session.userId);
   res.render('home',{
    Userdata
   })
}