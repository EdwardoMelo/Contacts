const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT
const mongoose = require('mongoose'); //module that establishes the connection with the db
const session = require('express-session');
const  MongoStore = require('connect-mongo'); //importingo the mongo constructors 
const flash = require ('connect-flash'); //flash massages 

const routes = require('./routes'); //route.js files 
const path = require('path'); // path module that compounds that root directory from the __dirname
const helmet = require('helmet');
const csrf = require('csurf');
const {middleware, checkCsrfError, csrfMiddleware}  = require('./src/middlewares/middleware');
const cookieParser = require('cookie-parser');

app.use(helmet());
app.use(express.urlencoded( {  extended: true }));
app.use(express.static(path.resolve(__dirname, 'public'))) //use static files like bundle
app.use(cookieParser());

mongoose.connect(process.env.CONNECTIONSTRING).then(() =>{ //initializing connection with db and emitting the starter of the listener
    app.emit('pronto');
  }).catch(e => console.log(e));

app.use(session({ //generic session definitions 
    secret: 'secret-key',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUnitialized: false,
    cookie:{
        maxAge: 1000 *60 *60 *24 *7,
        httpOnly: true,
    }
}));

app.use(flash());

app.set('views', path.resolve(__dirname,'src','views') );
app.set('view engine', 'ejs'); //colocar scripts no html

app.use(csrf());
app.use(middleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.get('/', (req, res) =>{
    res.json('Hello World');
})


app.on('pronto', () => {
    app.listen(port || 3000, () =>{
        console.log(`Server Listening to port ${port}`);
    });
});
