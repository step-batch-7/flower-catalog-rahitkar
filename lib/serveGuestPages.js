const fs = require('fs');
const Response = require('./response');
const STATIC_FOLDER = `${__dirname}`;

const updateComments = (previousComment, newComment) => {
  const comments = previousComment.slice();
  const resentComment = {
    dateTime: new Date(),
    name: `${newComment.name}`,
    commentList: `${newComment.comment}`
  };
  comments.unshift(resentComment);
  
  fs.writeFileSync(`${STATIC_FOLDER}/../dataBase/comments.json`,JSON.stringify(comments));
};

const loadComments = () => {
  const comments = fs.readFileSync(`${STATIC_FOLDER}/../dataBase/comments.json`, "utf8");
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
  console.log(STATIC_FOLDER);
  
  const path = `${STATIC_FOLDER}/../public/guestBook.html`;
  const content = fs.readFileSync(path, "utf8");
  const comments = loadComments().reduce(getTableHtml, "");

  const newContent = content.replace("__COMMENTS__", comments);
  const res = new Response();
  res.setHeader("Content-Length", newContent.length);
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.body = newContent;
  return res;
};

const servePost = req => {
  const path = `${STATIC_FOLDER}/../public/${req.url}`;
  updateComments(loadComments(), req.body);

  const updatedComments = loadComments();

  const comments = updatedComments.reduce(getTableHtml, "");
  const content = fs.readFileSync(path, 'utf8');
  const newContent = content.replace("__COMMENTS__", comments);
  const res = new Response();
  res.setHeader("Content-Length", newContent.length);
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.body = newContent;
  return res;
};

module.exports = {serveGuestBook, servePost};