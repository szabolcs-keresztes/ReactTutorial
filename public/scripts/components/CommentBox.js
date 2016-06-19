
import React from "react";

import Config from "./../config";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

// commentBox.js

// Comment box component, this will contain the comment list and the comment form
var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: Config.endpoints.comments,
			dataType: 'json',
			cache: false,

			success: (data) => {
				this.setState({data: data});
			},

			error: (xhr, status, err) => {
			}
		});
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		$.ajax({
		    url: Config.endpoints.comments,
		    dataType: 'json',
		    type: 'POST',
		    data: comment,

		    success: (data) => {
		        this.setState({data: data});
		    },

		    error: (xhr, status, err) => {
		    	this.setState({data: comments});
		    }
    	});
	},

	// Question: Is this function in the good place? Shouldn't we move to the CommentList component?
	// Answear: Yes, this is the class which controls the Comment components.

	handleCommentDelete: function(commentId) {
		$.ajax({

			// Note: Probably not the best way to have this visible URL for delete. :)

			url: Config.endpoints.comment + "/" + commentId,
			dataType: 'json',
			type: 'DELETE',
			cache: false,

			success: (data) => {
				this.setState({data: data});
			},

			// Question: What happens if the delete was not successful? What binding do we do?
			// Answear: The bind function is called because we don't want to override 
			//			the 'this' keyword.
			//			We don't really implement what will happen with the data on error.

			error: (xhr, status, err) => {
			}
		});
	},

	handleCommentLike: function(commentId) {


		$.ajax({

			url: Config.endpoints.comment + "/" + commentId + "/like",
			type: 'PUT',

			success: () => {
				var newData = Object.assign([], this.state.data);
				

				var comment = newData.filter((comment) => {
					return comment._id == commentId;
				})[0];

				comment.likeCount++;

				this.setState({data: newData});
			},

			error: (xhr, status, err) => {
			}

		});
	},

	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(
			this.loadCommentsFromServer,
			Config.pollInterval
		);
	},
	render: function() {
		return (
			<div className="commentBox">
        		<h1>Comments</h1>
        		<CommentList data={this.state.data} 
        					 onCommentDelete={this.handleCommentDelete}
        					 onCommentLike={this.handleCommentLike} />
        		<CommentForm onCommentSubmit={this.handleCommentSubmit} />
      		</div>
		);
	}
});

export default CommentBox;