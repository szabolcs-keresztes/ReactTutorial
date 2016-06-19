
import React from "react";
import Comment from "./Comment"

// commentList.js

// This is a compoent for Comment List

var CommentList = React.createClass({
	render: function() {

		// Question: Saving the function before the map function is a good idea?

		var onCommentDeleteCallback = this.props.onCommentDelete;
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment _id={comment._id} 
						 author={comment.author} 
						 key={comment.id} 
						 onCommentDelete={onCommentDeleteCallback}>
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