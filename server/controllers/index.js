const db = require('../model');

module.exports = {
  getIndex(req, res) {
    res.render('index', {
      skills: db.get('skills').value(),
      products: db.get('products').value(),
    });
  },

  getMessage(req, res) {
    db.get('message').push(req.body).write();
    res.redirect('/');
  }
};
