const Login = require('../models/loginModel.');

exports.index = (req, res) =>{
   if (req.session.user) res.render('login-logado')
   return res.render('login');
};

exports.register = async function(req, res){
    try{
    const login = new Login(req.body);
    await login.register();
    console.log(login.errors)

    if (login.errors.length > 0){
        req.flash('errors', login.errors); //errors é o array que será chamado no front
        req.session.save(function(){
            return res.redirect('./index');
        });
        return;
    };
    req.flash('success', `Seu usuário foi criado com sucesso, ${login.body.email}`);
    req.session.save(function(){
    return res.redirect('./index');
    });

}catch(e){
    console.log(e)
    res.render('404');
}
};

exports.login = async function(req, res){
    try{
    const login = new Login(req.body);
    await login.login();
    console.log(login.errors)

    if (login.errors.length > 0){
        req.flash('errors', login.errors); //errors é o array que será chamado no front
        req.session.save(function(){
            return res.redirect('./index');
        });
        return;
    };
    req.flash('success', `Você logou no sistema!`);
    req.session.user = login.user;
    req.session.save(function(){
    return res.redirect('./index');
    });

}catch(e){
    console.log(e)
    res.render('404');
}
};

exports.logout = function (req, res){
    req.session.destroy()
    res.redirect('/');
}