const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

require('dotenv').config();

const controllerIndex = require('../controllers/index');
const controllerLogin = require('../controllers/login');
const controllerAdmin = require('../controllers/admin');

const isAdmin = (req, res, next) => {
  let decode = '';
  try {
    decode = jwt.verify(req.signedCookies.jwt, process.env.JWT_SIGNATURE);
  } catch (err) {
    res.redirect('/');
  }

  if (decode.role==='admin') {
    next();
  } else {
    res.redirect('/');
  }  
};

router.get('/', controllerIndex.getIndex);
router.post('/', controllerIndex.getMessage);

router.get('/login', controllerLogin.getLogin);
router.post('/login', controllerLogin.auth);

router.get('/register', controllerLogin.getRegister);
router.post('/register', controllerLogin.register);

router.get('/admin', isAdmin, controllerAdmin.getAdmin);

router.post('/admin/upload', isAdmin, controllerAdmin.setProduct);

router.post('/admin/skills', isAdmin, controllerAdmin.setSkills);

module.exports = router;
