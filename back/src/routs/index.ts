// const { Router } = require('express');
import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = require('../../../swagger.json');

require('dotenv').config();

import user from '../controllers/api/user'
import news from '../controllers/api/news'
import Guard from '../guards/index.guards';

const router = express.Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

router.get('', (req, res) => {
  res.sendFile(path.join(__dirname + './../../../../front/build/index.html'))
})

router.post('/api/registration', user.registration);//
router.post('/api/login', user.login);//
router.post('/api/refresh-token', Guard, user.updateToken);//
router.get('/api/profile', Guard, user.profile);//
router.patch('/api/profile', Guard, user.updateProfile); // avatar
router.delete('/api/users/:id', Guard, user.deleteUser);//
router.get('/api/users', Guard, user.getUsers);//
router.patch('/api/users/:id/permission', Guard, user.permissionUser);//

router.get('/api/news', Guard, news.getNews);//
router.post('/api/news', Guard, news.setNews);//
router.patch('/api/news/:id', Guard, news.updateNews);
router.delete('/api/news/:id', Guard, news.deleteNews);//

module.exports = router;
