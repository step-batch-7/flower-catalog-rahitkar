const fs = require('fs');
const STATIC_FOLDER = `${__dirname}`;

const updateComments = (previousComment, newComment) => {
  const comments = previousComment.slice();
  const resentComment = {
    dateTime: new Date(),
    name: `${newComment.name}`,
    commentList: `${newComment.comment}`
  };
  comments.unshift(resentComment);

  fs.writeFileSync(
    `${STATIC_FOLDER}/../dataBase/comments.json`,
    JSON.stringify(comments)
  );
};

const loadComments = () => {
  const comments = fs.readFileSync(
    `${STATIC_FOLDER}/../dataBase/comments.json`,
    'utf8'
  );
  return JSON.parse(comments);
};

module.exports = {loadComments, updateComments};
