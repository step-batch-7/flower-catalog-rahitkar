const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const {getTableHtml} = require('./getTableHtml');
const {loadComments, updateComments} = require('./comment');
const parseBody = require('./bodyParser');
const {App} = require('./app');

const STATIC_FOLDER = `${__dirname}`;

const servePost = function(req, res) {
  updateComments(loadComments(), req.body);
  res.statusCode = 303;
  res.setHeader('location', 'guestBook.html');
  res.end();
};

const serveGuestBook = function(req, res) {
  const path = `${STATIC_FOLDER}/../public/guestBook.html`;
  const content = fs.readFileSync(path, 'utf8');
  const comments = loadComments().reduce(getTableHtml, '');

  const newContent = content.replace('__COMMENTS__', comments);
  const okStatusCode = 200;
  res.writeHead(okStatusCode, {
    'Content-Length': newContent.length,
    'Content-Type': 'text/html'
  });
  res.end(newContent);
};

const serveNotFound = function(req, res) {
  const notFoundStatusCode = 404;
  res.writeHead(notFoundStatusCode);
  res.end('Not Found');
};

const isCorrectPath = absolutePath => {
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  return !stat || !stat.isFile();
};

const serveStaticFile = (req, res, next) => {
  const publicFolder = `${STATIC_FOLDER}/../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = `${publicFolder}${path}`;
  if (isCorrectPath(absolutePath)) {
    return next();
  }
  const content = fs.readFileSync(absolutePath);
  const extension = absolutePath.split('.').pop();

  const okStatusCode = 200;
  res.writeHead(okStatusCode, {
    'Content-Length': content.length,
    'Content-Type': CONTENT_TYPES[extension]
  });
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    if (data) {
      req.body = parseBody(data);
      return next();
    }
    req.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);

app.get('/guestBook.html', serveGuestBook);
app.get('', serveStaticFile);
app.get('', serveNotFound);

app.post('/guestBook.html', servePost);
app.post('', serveNotFound);

module.exports = {app};
