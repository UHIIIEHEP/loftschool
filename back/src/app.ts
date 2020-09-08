import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();

const port: number = Number(process.env.APP_PORT) || 3000;

app.use(express.static(path.join(__dirname + './../../../front/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('', require('./routs'));

app.use('*', (req, res) => {
  const file = path.resolve(process.cwd(), '../front', 'build', 'index.html')
console.log({file})
  res.sendFile(file)
})

app.listen(port, () => {
  console.log('Server start. Port ', port)
})
