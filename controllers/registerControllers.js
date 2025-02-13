module.exports = (req, res) => {

    let username = "";
    let email = "";
    let password = "";
    let data = req.flash('data')[0];

    if (typeof data != 'undefined') {
        
        username = data.username;
        email = data.email;
        password = data.password;
    };



    res.render('register', {
        errors: req.flash('validationErrors'),
        username: username,
        email: email,
        password: password
    });
}