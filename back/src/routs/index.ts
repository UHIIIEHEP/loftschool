// const { Router } = require('express');
import express from 'express';
import path from 'path';

require('dotenv').config();

import user from '../controllers/api/user'
import news from '../controllers/api/news'
import Guard from '../guards/index.guards';

const router = express.Router();

router.get('', (req, res) => {
  res.sendFile(path.join(__dirname + './../../../../front/build/index.html'))
})

router.post('/registration', user.registration);
router.post('/login', user.login);
router.post('/refresh-token', Guard, user.updateToken);
router.get('/profile', Guard, user.profile);
router.patch('/profile', Guard, user.updateProfile);
router.delete('/users/:id', Guard, user.deleteUser);
router.get('/users', Guard, user.getUsers);
router.patch('/users/:id/permission', Guard, user.permissionUser);

router.get('/news', Guard, news.getNews);
router.post('/news', Guard, news.setNews);
router.patch('/news/:id', Guard, news.updateNews);
router.delete('/news/:id', Guard, news.deleteNews);

module.exports = router;
