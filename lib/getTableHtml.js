const getTableHtml = (previousComment, comment) => {
  let allComments = previousComment;
  const newComment = comment.commentList.replace(/ /g, '&nbsp');
  const html = `
  <tr>
    <td>${comment.dateTime}</td>
    <td>${comment.name}</td>
    <td>${newComment.replace(/\n/g, '<br>')}</td>
  </tr>`;
  allComments += html;
  return allComments;
};

module.exports = {getTableHtml};
