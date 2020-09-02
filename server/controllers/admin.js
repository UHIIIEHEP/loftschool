const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const db = require('../model');

module.exports = {
  getAdmin(req, res) {
    res.render('admin');
  },

  setProduct(req, res) {
    const form = new formidable.IncomingForm();
    const upload = path.join('public/assets/img', 'products');

    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, (err, fields, files) => {
      const fileName = path.join(upload, files.photo.name);

      fs.rename(files.photo.path, fileName, () => {
        db.get('products').push({
          src: fileName.replace('public', '.'),
          name: fields.name,
          price: fields.price,
        }).write();
      });
    });
    
    res.redirect('/admin');
  },
  
  setSkills(req, res) {
    const params = ['age', 'concerts', 'cities', 'years'];

    const body = db.get('skills').value();

    params.forEach((params, index) => {
      db.get('skills')
        .find(body[index])
        .assign({
          number: Number(req.body[params]),
          text: body[index].text
        })
        .write();
    });

    res.redirect('/admin');
  },
};
