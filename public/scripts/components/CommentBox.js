
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
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
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
		    success: function(data) {
		        this.setState({data: data});
		    }.bind(this),
		    error: function(xhr, status, err) {
		    	this.setState({data: comments});
		    	console.error(this.props.url, status, err.toString());
		    }.bind(this)
    	});
	},

	// Question: Is this function in the good place? Shouldn't we move to the CommentList component?

	handleCommentDelete: function(commentId) {
		$.ajax({

			// Note: Probably not the best way to have this visible URL for delete. :)

			url: Config.enpoints.comment + "/" + commentId,
			dataType: 'json',
			type: 'DELETE',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),

			// Question: What happens if the delete was not successful? What binding do we do?

			error: function(xhr, status, err) {
				console.log("Something went wrong!");
				console.error(this.props.urlForOne + "/" + commentId, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(
			this.loadCommentsFromServer,
			this.props.pollInterval
		);
	},
	render: function() {
		return (
			<div className="commentBox">
        		<h1>Comments</h1>
        		<CommentList data={this.state.data} onCommentDelete={this.handleCommentDelete} />
        		<CommentForm onCommentSubmit={this.handleCommentSubmit} />
      		</div>
		);
	}
});

export default CommentBox;