const { throws } = require('assert');
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { async } = require('regenerator-runtime');
const loginSchema = new mongoose.Schema({ //schema to login 
    email: {type: String, required: true},
    password: {type: String, required: true},
});
const loginModel = mongoose.model('login', loginSchema);


class Login { 
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    
   async register(){
        this.valida()
        if (this.errors.length > 0 ) return;
       
       await this.userExists()
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
        this.user = await loginModel.create(this.body); // craindo registro 

    };
    async login(){
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await loginModel.findOne({email: this.body.email});

        if(!this.user) {
            this.errors.push('usuário não existe');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida!');
            this.user = null;
            return;
        };
    }
    
     async userExists(){
      const register = await loginModel.findOne({ email: this.body.email });
        if (register){
            console.log(this.body.email)
            this.errors.push('Usuário já existe');
        };
    }

    valida() {
       this.cleanUp();  
       if (!validator.isEmail(this.body.email)) 
       this.errors.push('Email Inválido')
       if (this.body.password.length < 3 || this.body.password.length >=50){
        this.errors.push('A senha precisa ter entre 3 e 50 caracteres!');
       }
    };
    cleanUp(){
        for (let key in this.body){
            if (typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    };
};

module.exports = Login;