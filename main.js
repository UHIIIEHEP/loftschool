const http = require('http');
const url = require('url');
const yargs = require('yargs')

const host = '127.0.0.1';
const port = 4000;

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
  .epilog('Homework 2/1')
  .argv;



const server = http.createServer(async (req, res) => {
  const {
    pathname,
  } = url.parse(req.url,true);
  if (pathname === '/start') {
    const id = req.headers['x-request-id'];

    await outDate(args.interval, args.stop, id);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Timer started');
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`<a href=${host}:${port}/start>go to start</a>`);
  }
});

server.listen(port, host, async () => {
  console.clear();
  await start(1000);
  console.log(`Server running at http://${host}:${port}/`);
});

const outDate = (interval, stop, id = null) => {
  const timerId = setInterval( ()=>{
    const date = new Date;
    console.log(`Now time: ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} `, id!==null?`id: ${id} `:'');
  }, interval)
  
  setTimeout( ()=>{
    clearInterval(timerId);
    const date = new Date;
    console.log(`Stop: ${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`);
  }, stop)
}

const start = (step) => {
  setInterval(()=>{
    const date = new Date;
    console.log(`Now ${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}:${date.getUTCMilliseconds()}`);
  }, step)
};
