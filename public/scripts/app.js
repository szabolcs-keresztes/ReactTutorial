
import React from "react";
import ReactDOM from "react-dom";
import CommentBox from "./components/CommentBox"

ReactDOM.render(

	// Question: How can we pass the different urls in a more simple way?
	// Answear: We put the enpoint links to a config file. 
	//			Then we import the Config file where we need the enpoint names.

	<CommentBox />,
	document.getElementById('content')
);
