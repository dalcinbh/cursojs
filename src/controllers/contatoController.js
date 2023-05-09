const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
    const contato = {}

    res.render('contato', { contato });
}

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => {
                res.redirect('/contato/index');
            });
            return;
        }
        req.flash('success', 'Contato registrado com sucesso');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`);
        })
        return;
    } catch (err) {
        console.log(err);
        res.render('404');
    }

}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render(404);
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) {
        res.render('404');
    } else {
        res.render('contato', {
            contato
        });
    }
}

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => {
                res.redirect('/contato/index');
            });
            return;
        }
        req.flash('success', 'Contato editado com sucesso');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`);
        })
        return;
    } catch (err) {
        res.render('404');
    }
}

exports.delete = async (req, res) => {
    if (!req.params.id) return res.render(404);
    Contato.delete(req.params.id);
    req.flash('success', 'Contato deletado com sucesso');
    req.session.save(() => {
        res.redirect('/');
    })
}