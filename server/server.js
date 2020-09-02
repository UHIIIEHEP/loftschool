const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookierParser = require('cookie-parser');

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start. Port ${port}`);
});