const Login = require("../models/LoginModel");

exports.index = ((req, res) => {
    if(!req.session.user){
        return res.render('login');
    }else{
        return res.redirect('/');
    }
    return;
});

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.register();
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }
        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(function () {
            return res.redirect('/login/index');
        });
        return;
    } catch (err) {
        console.log(err);
        res.render('404');
    }
};

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }
        req.flash('success', 'Entrou no sistema com sucesso.');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/login/index');
        });
        return;
    } catch (err) {
        console.log(err);
        res.render('404');
    }
}

exports.logout = function(req, res){
    req.flash('success','Usuário deslogado com sucesso');
    req.session.destroy();
    res.redirect('/login/index');
}