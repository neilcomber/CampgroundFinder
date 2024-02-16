const User = require('../models/user');

module.exports.renderNewUserForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try{
    const { email, username, password } = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    });
}
catch(e){
    req.flash('error', e.message);
    res.redirect('register')
}    
}

module.exports.renderLoginForm = (req, res)=> {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(e){
        if (e) {
            return next(e);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    });
    
}