const fs = require("fs");
const Response = require("./lib/response");
const CONTENT_TYPES = require("./lib/mimeType");
const {serveGuestBook, servePost} = require("./lib/serveGuestPages");

const STATIC_FOLDER = `${__dirname}/public`;



const serveHomePage = () => {
  const res = new Response();
  const path = `${STATIC_FOLDER}/index.html`;
  const content = fs.readFileSync(path);
  res.setHeader("Content-Length", content.length);
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return new Response();
  }
  const res = new Response();
  const content = fs.readFileSync(path);
  const [, extension] = path.split(".");
  const type = CONTENT_TYPES[extension];
  res.setHeader("Content-Length", content.length);
  res.setHeader("Content-Type", type);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const findHandler = req => {
  console.log(req);
  
  if (req.method === "GET" && req.url === "/guestBook.html") {
    return serveGuestBook;
  }
  if (req.method === "POST" && req.url === "/guestBook.html") {
    return servePost;
  }
  if (req.method === "GET" && req.url === "/") {
    return serveHomePage;
  }
  if (req.method === "GET") {
    return serveStaticFile;
  }
  return () => new Response();
};

const processRequest = req => {
  const handler = findHandler(req);
  return handler(req);
};
module.exports = { processRequest };
