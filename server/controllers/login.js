const db = require('../model');
const { generateToken, generateHach } = require('../libs');

require('dotenv').config();

module.exports = {
  getLogin(req, res) {
    console.log(res.cookies); //('jwt'));
    res.render('login');
  },

  auth(req, res) {
    const {
      email,
      password,
    } = req.body;

    const users = db.get('user').value();

    for (const user of users) {
      if (user.email !== email ) {
        continue;
      } else if (user.password === generateHach(password) ) {
        const token = generateToken({role: user.role});

        res.cookie('jwt', token,{
          signed:true,
        });

        res.redirect('/admin');

        break;
      } else {
        res.redirect('/login');
      }
    }
  },

  getRegister(req, res) {
    res.render('register');
  },

  register(req, res) {
    const {
      email,
    } = req.body;

    const users = db.get('user')
      .value();

    for (const user of users) {
      if (user.email === email ) {
        res.redirect('/register');
      }
    }

    req.body.password  = generateHach(req.body.password);

    db.get('user').push(req.body).write();

    const token = generateToken({role: req.body.role});

    res.cookie('jwt', token,{
      signed:true,
    });

    res.redirect('/admin');

    res.redirect('/');
  }
};

