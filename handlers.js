const fs = require("fs");
const CONTENT_TYPES = require("./lib/mimeType");

const STATIC_FOLDER = `${__dirname}`;

const parseParams = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = decodeURIComponent(value.replace(/\+/g, " "));
  return query;
};

const readParams = keyValuePairs => {
  return keyValuePairs.split("&").reduce(parseParams, {});
};

const updateComments = (previousComment, newComment) => {
  const comment = readParams(newComment);
  console.log(comment);

  const comments = previousComment.slice();
  const resentComment = {
    dateTime: new Date(),
    name: `${comment.name}`,
    commentList: `${comment.comment}`
  };
  comments.unshift(resentComment);

  fs.writeFileSync(
    `${STATIC_FOLDER}/dataBase/comments.json`,
    JSON.stringify(comments)
  );
};

const loadComments = () => {
  const comments = fs.readFileSync(
    `${STATIC_FOLDER}/dataBase/comments.json`,
    "utf8"
  );
  return JSON.parse(comments);
};

const getTableHtml = (previousComment, comment) => {
  let newComment = comment.commentList.replace(/ /g, "&nbsp");
  const html = `
  <tr>
    <td>${comment.dateTime}</td>
    <td>${comment.name}</td>
    <td>${newComment.replace(/\n/g, "<br>")}</td>
  </tr>`;
  previousComment += html;
  return previousComment;
};

const servePost = function(req, res) {
  const path = `${STATIC_FOLDER}/public${req.url}`;
  console.log(path);

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    updateComments(loadComments(), body);
  });

  res.statusCode = 303;
  res.setHeader('location','guestBook.html')
  res.end();
};

const serveGuestBook = function(req, res) {
  const path = `${STATIC_FOLDER}/public/guestBook.html`;
  const content = fs.readFileSync(path, "utf8");
  const comments = loadComments().reduce(getTableHtml, "");

  const newContent = content.replace("__COMMENTS__", comments);
  res.setHeader("Content-Length", newContent.length);
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.write(newContent);
  res.end();
};

const serveHomePage = function(req, res) {
  const content = fs.readFileSync(`${STATIC_FOLDER}/public/index.html`);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", content.length);
  res.write(content);
  res.end();
};

const defaultResponse = function(req, res) {};

const serveStaticFile = (req, res) => {
  const path = `${STATIC_FOLDER}/public/${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    defaultResponse(req, res);
  }
  const content = fs.readFileSync(path);
  const [, extension] = path.split(".");
  const type = CONTENT_TYPES[extension];
  res.setHeader("Content-Length", content.length);
  res.setHeader("Content-Type", type);
  res.statusCode = 200;
  res.write(content);
  res.end();
};

module.exports = {
  serveGuestBook,
  servePost,
  serveHomePage,
  serveStaticFile,
  defaultResponse
};
