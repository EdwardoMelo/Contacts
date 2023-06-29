const { render } = require('ejs');
const { async } = require('regenerator-runtime');
const Contato = require('../models/contatoModel');

exports.index = (req, res) =>{
    res.render('contato', {
        contato: {}
    });
};
exports.register = async function (req, res){
    try{
        const contato = new Contato(req.body);
        await contato.register();
        if (contato.errors.length > 0){
            console.log(contato.errors);
            req.flash('errors', contato.errors );
            req.session.save(function(){
                return res.redirect('./index');
            });
            return;
        }
    req.flash('success', `Seu contato foi registrado com sucesso`);
    req.session.save(function(){
    return res.redirect(`./index/${contato.contato._id}`);
    });

    }catch(e){
         console.log(e);
         return res.render('404');
    };
}

exports.editindex = async (req, res) =>{
    if(!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id)
    if(!contato) return res.render('404');

    res.render('contato', {contato});
};

exports.edit = async (req, res) =>{
try{
    if(!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);


    if (contato.errors.length > 0){
        console.log(contato.errors);
        req.flash('errors', contato.errors );
        req.session.save(() => res.redirect(`../index/${req.params.id}`));
        return;
    };
    
    req.flash('success', `Seu contato foi editado com sucesso`);
    req.session.save(() => res.redirect(`../index/${contato.contato._id}`));
    return;
}catch(e){
    console.log(e);
    return render('404');
}
    
};
exports.delete = async (req, res) =>{
    if (!req.params.id) return res.render('404');
    const contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404');

    req.flash('success', 'Contato apagado');
    req.session.save(() => res.redirect('/'));
    return;
};
