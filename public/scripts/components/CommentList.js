
import React from "react";
import Comment from "./Comment"

// commentList.js

// This is a compoent for Comment List

var CommentList = React.createClass({
	render: function() {

		// Question: Saving the function before the map function is a good idea?
		// Answear: Yes it is a good idea, however we should use the fat arrow in this case.
		//			Functions with fat arrows will not override the 'this' keyword.

		var commentNodes = this.props.data.map((comment) => {
			return (
				<Comment _id={comment._id} 
						 author={comment.author} 
						 key={comment.id} 
						 likeCount={comment.likeCount}
						 onCommentDelete={this.props.onCommentDelete}
						 onCommentLike={this.props.onCommentLike}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
        		{commentNodes}
      		</div>
		);
	}
});

export default CommentList;