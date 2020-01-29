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

module.exports = { getTableHtml };
