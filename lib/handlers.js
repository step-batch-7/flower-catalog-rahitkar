const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { getTableHtml } = require('./getTableHtml');
const Comments = require('./comment');
const { App } = require('./app');
const querystring = require('querystring');

const CONFIG_PATH = require('./config').DATA_STORE;
const STATIC_FOLDER = `${__dirname}`;
const DATA_STORE = CONFIG_PATH || `${STATIC_FOLDER}/../dataBase/comments.json`;

const servePost = function(req, res) {
  const fileContent = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
  const comments = new Comments();
  comments.loadComments(JSON.parse(fileContent));
  req.body.dateTime = new Date().toLocaleString();
  const allComments = comments.updateComments(req.body);
  fs.writeFileSync(DATA_STORE, JSON.stringify(allComments));
  const redirectStatusCode = 303;
  res.writeHead(redirectStatusCode, {
    location: '/guestBook.html'
  });
  res.end();
};

const serveGuestBook = function(req, res) {
  const path = `${STATIC_FOLDER}/../public/guestBook.html`;
  const content = fs.readFileSync(path, 'utf8');
  const allComments = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
  const comments = new Comments();
  comments.loadComments(JSON.parse(allComments));

  const commentHtml = comments.allComments.reduce(getTableHtml, '');

  const newContent = content.replace('__COMMENTS__', commentHtml);
  const okStatusCode = 200;
  res.writeHead(okStatusCode, {
    'Content-Length': newContent.length,
    'Content-Type': 'text/html'
  });
  res.end(newContent);
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

const serveNotFound = function(req, res) {
  const notFoundStatusCode = 404;
  res.writeHead(notFoundStatusCode);
  res.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  const methodNotAllowedStatusCode = 400;
  res.writeHead(methodNotAllowedStatusCode);
  res.end('method not allowed');
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    if (data) {
      data = querystring.parse(data);
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

app.use('', methodNotAllowed);

module.exports = app;
