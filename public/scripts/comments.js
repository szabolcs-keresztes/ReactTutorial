

// Comment box component, this will contain the comment list and the comment form
var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
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
		    url: this.props.url,
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

			url: this.props.urlForOne + "/" + commentId,
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

var CommentForm = React.createClass({
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (!text || !author) {
			return;
		}
		this.props.onCommentSubmit({author: author, text: text});
		this.setState({author: '', text: ''})
	},
	getInitialState: function() {
		return {author: '', text: ''};
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
		        <input
          			type="text"
          			placeholder="Your name"
          			value={this.state.author}
          			onChange={this.handleAuthorChange}
        		/>
		        <input
          			type="text"
          			placeholder="Say something..."
          			value={this.state.text}
          			onChange={this.handleTextChange}
        		/>
		        <input type="submit" value="Post" />
		    </form>
		);
	}
});

var Comment = React.createClass({

	// Question: Is it good that the _id is in the memory?

	handleDelete: function() {
		this.props.onCommentDelete(this.props._id);
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
				</div>
			</div>
		);
	}
});

ReactDOM.render(

	// Question: How can we pass the different urls in a more simple way?

	<CommentBox url="/api/comments/" urlForOne="/api/comment" pollInterval={2000} />,
	document.getElementById('content')
);
