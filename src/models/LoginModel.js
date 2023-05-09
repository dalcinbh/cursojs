const mongoose = require("mongoose");
const validator = require('validator');
const bcryptjs = require('bcrypt');

const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true,
    }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null
    }

    async login() {
        this.valida();

        if (this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('Verifique suas credenciais de acesso 1');
            return;
        }

        if (!bcryptjs.compareSync(this.body.senha, this.user.senha)) {
            this.errors.push('Verifique suas credenciais de acesso 2');
            this.user = null;
            return;
        }

    }

    async register() {
        this.valida();

        if (this.errors.length > 0) return;
        await this.userExists();
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.user = await LoginModel.create(this.body);
    }

    valida() {
        this.cleanUp();
        //Validação
        //O email precisa ser válido
        //Senha precisa te entre 3 e 50
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail Inválido');
        }

        if (this.body.senha.length < 3 || this.body.senha.length > 50) {
            this.errors.push('A senha precisa te entre 3 e 50 caractéres');
        }
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }

    async userExists() {
        try {
            this.user = await LoginModel.findOne({ email: this.body.email });
            if (this.user) {
                console.log(user);
                this.errors.push('Usuário já Existe');
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Login;