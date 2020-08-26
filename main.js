const http = require('http');
const url = require('url');
const yargs = require('yargs')

const args = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('0.0.1')
  .alias('version', 'v')
  .options('interval', {
    alias: 'i',
    describe: 'Interval input date',
    demandOption: true,
  })
  .options('stop', {
    alias: 's',
    description: 'Stop interval',
    demandOption: true,
  })
  .options('host', {
    alias: 'l',
    description: 'host',
    default: '127.0.0.1',
  })
  .options('port', {
    alias: 'p',
    description: 'Port',
    default: 4000,
  })
  .epilog('Homework 2/1')
  .argv;

  const {
    host,
    port,
    interval: stepInterval,
    stop: stopinterval,
  } = args;

const server = http.createServer(async (req, res) => {
  const id = req.headers['x-request-id'];

  await outDate(stepInterval, stopinterval, res, id);
});

server.listen(port, host, async () => {
  console.clear();
  console.log(`Server running at http://${host}:${port}/`);
});

const outDate = (interval, stop, res, id = null) => {
  const timerId = setInterval( ()=>{
    const date = new Date;
    console.log(`Now time: ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} `, id!==null?`id: ${id} `:'');
  }, interval)
  
  setTimeout( ()=>{
    clearInterval(timerId);
    const date = new Date;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`)
  }, stop)
}
