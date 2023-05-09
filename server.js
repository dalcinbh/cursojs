require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const csrf = require("csurf");
mongoose.connect(process.env.CONNECTIONSTRING)
    .then((res) => {
        app.emit('bancotrue');
    })
    .catch((err) => {
        console.log(err);
    })

const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');

const routes = require("./routes");
const path = require("path");
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require("./src/middlewares/middleware");
const port = 3000;

//app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
const sessionOptions = session({
    secret: 'df;bffkjdsbslhdbfhjlsdbfhjsbfjhlsf',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})
app.use(sessionOptions);
app.use(flash());

app.set('view engine', 'ejs');
//nossos próprios middlewares
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('bancotrue', () => {
    app.listen(port, () => {
        console.log(`Servidor inciado na porta ${port}`);
    });
})

