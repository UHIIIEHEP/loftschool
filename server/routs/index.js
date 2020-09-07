const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

require('dotenv').config();

const controllerIndex = require('../controllers/index');
const controllerLogin = require('../controllers/login');
const controllerAdmin = require('../controllers/admin');
const { validate, Joi } = require('express-validation');

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
    throw new Error ('forbiden');
  }  
};

const validLogin = {  
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  })
};

const validRegister = {  
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  })
};

const validScills = {  
  body: Joi.object({
    age: Joi.number()
      .positive()
      .required(),
    concerts: Joi.number()
      .positive()
      .required(),
    cities: Joi.number()
      .positive()
      .required(),
    years: Joi.number()
      .positive()
      .required(),
  })
};

const validUpload = {  
  body: Joi.object({
    photo: Joi.any(),
    name: Joi.string()
      .required(),
    price: Joi.string()
      .required(),
  })
};

router.get('/', controllerIndex.getIndex);
router.post('/', controllerIndex.getMessage);

router.get('/login', controllerLogin.getLogin);
router.post('/login', validate(validLogin, {}, {}), controllerLogin.auth);

router.get('/register', controllerLogin.getRegister);
router.post('/register', validate(validRegister, {}, {}), controllerLogin.register);

router.get('/admin', isAdmin, controllerAdmin.getAdmin);

router.post('/admin/upload', isAdmin, validate(validUpload, {}, {}), controllerAdmin.setProduct);

router.post('/admin/skills', isAdmin, validate(validScills, {}, {}), controllerAdmin.setSkills);

module.exports = router;
