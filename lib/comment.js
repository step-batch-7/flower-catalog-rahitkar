const fs = require('fs');
const STATIC_FOLDER = `${__dirname}`;

const parseParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  return query;
};

const readParams = keyValuePairs => {
  return keyValuePairs.split('&').reduce(parseParams, {});
};

const updateComments = (previousComment, newComment) => {
  const comment = readParams(newComment);

  const comments = previousComment.slice();
  const resentComment = {
    dateTime: new Date(),
    name: `${comment.name}`,
    commentList: `${comment.comment}`
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
