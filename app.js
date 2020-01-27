const fs = require("fs");
const Response = require("./lib/response");
const CONTENT_TYPES = require("./lib/mimeType");

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
const loadComments = () => {
  const comments = fs.readFileSync("./dataBAse/comments.json");
  return JSON.parse(comments);
};

const getTableHtml = (previousComment, comment) => {
  const html = `
  <tr>
    <td>${comment.dateTime}</td>
    <td>${comment.name}</td>
    <td>${comment.commentList}</td>
  </tr>`;
  previousComment += html;
  return previousComment;
};

const serveGuestBook = () => {
  const path = `${STATIC_FOLDER}/guestBook.html`;
  const content = fs.readFileSync(path, "utf8");
  const comments = loadComments().reduce(getTableHtml, "");

  const newContent = content.replace("__COMMENTS__", comments);
  const res = new Response();
  res.setHeader("Content-Length", newContent.length);
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.body = newContent;
  console.log(res);
  return res;
};

const findHandler = req => {
  if (req.method === "GET" && req.url === "/guestBook.html") {
    return serveGuestBook;
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
