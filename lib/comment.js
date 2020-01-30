class Comments {
  constructor() {
    this.allComments = [];
  }
  updateComments(newComment) {
    const resentComment = {
      dateTime: new Date(),
      name: `${newComment.name}`,
      commentList: `${newComment.comment}`
    };
    this.allComments.unshift(resentComment);
    return this.allComments;
  }

  loadComments(content) {
    this.allComments = content;
  }
}

module.exports = Comments;
