const http = require('http');
const app = require('./lib/handlers');

const server = new http.Server(app.serve.bind(app));
const port = 4000;
server.listen(port, () => {
  process.stdout.write('listening started');
});
