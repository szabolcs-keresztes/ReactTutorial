
import React from "react";

// comment.js

// This is a comment component

var Comment = React.createClass({

	// Question: Is it good that the _id is in the memory?
	// Answear: Yes it is good.

	handleDelete: function() {
		this.props.onCommentDelete(this.props._id);
	},

	handleLike: function() {
		this.props.onCommentLike(this.props._id);
	},

	rawMarkup: function() {
		var md = new Remarkable();
		var rawMarkup = md.render(this.props.children.toString());
		return { 
			__html: rawMarkup
		};
	},

	render: function() {
		var md = new Remarkable();
		return (
			<div className="comment">
				<div>
					<h2 className="commentAuthor">
						{this.props.author}
					</h2>
					<span dangerouslySetInnerHTML={this.rawMarkup()} />
				</div>
				<div>
					<button onClick={this.handleDelete}>Delete</button>
					<button onClick={this.handleLike}>Like {this.props.likeCount}</button>
				</div>
			</div>
		);
	}
});

export default Comment;