class Comments {
  constructor() {
    this.allComments = [];
  }
  updateComments(newComment) {
    const recentComment = {
      dateTime: newComment.dateTime,
      name: newComment.name,
      commentList: newComment.comment
    };
    this.allComments.unshift(recentComment);
    return this.allComments;
  }

  loadComments(content) {
    this.allComments = content;
  }
}

module.exports = Comments;
