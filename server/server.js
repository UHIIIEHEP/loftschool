const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookierParser = require('cookie-parser');
const { ValidationError } = require('express-validation');

require('dotenv').config();

const app = express();

const port = Number(process.env.APP_PORT) || 3000;

app.set('views', path.join(__dirname, '../source/template/pages'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookierParser(process.env.JWT_SIGNATURE));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routs'));

app.use((err, req, res, next) => {
  let parseAddress = ['','login'];
  let msg = {msglogin: 'Any error'};

  if (err instanceof ValidationError) {
    parseAddress = req.path.split('/');

    if (parseAddress[1] === 'login') {
      msg = {msglogin: 'Bad valid'};
    } 
    if (parseAddress[1]  === 'register') {
      msg = {msgregister: 'Bad valid'};
    }
    if (parseAddress[1]  === 'admin') {
      if (parseAddress[2] === 'skills' ) {
        msg = {msgskill: 'Bad valid'};
      }
      if (parseAddress[2] === 'upload' ) {
        msg = {msgfile: 'Bad valid'};
      }
    }
    err.message = 'validation';
  }

  switch (err.message) {
  case 'bad_auth':
    res.status(404).render('login', {msglogin: 'Wrong login or password'});
    break;

  case 'email_use':
    res.status(404).render('register', {msgregister: 'Email use'});
    break;

  case 'forbiden':
    res.status(403).render('login', {msgregister: 'Forbiden'});
    break;

  case 'validation':
    res.status(404).render(parseAddress[1], msg);
    break;
  }
  next();
});

app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start. Port ${port}`);
});