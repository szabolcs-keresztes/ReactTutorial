

// server.js

// BASE SETUP
// =======================================================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

// configure app to use Body Parser
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// require a mongoose instance
var mongoose = require('mongoose');

// connect to a local mongodb database
mongoose.connect('mongodb://localhost:27017/jsTutorial');

// Require an instance of out model
var Comment = require('./app/models/comment');

// set our port
var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =======================================================================================================

// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('A request came in');

  // make sure we go to the next routes and don't stop here
  next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get(
  '/', 
  function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
  }
);


// on routes that end in /comments

router.route('/comments')
  .post(function(req, res) {
    var comment = new Comment();
    comment.id = Date.now();
    comment.author = req.body.author;
    comment.text = req.body.text;

    // save the comment and check for errors
    comment.save(function(err) {
      if (err) {
        res.send(err);
      }
      Comment.find(function(err, comments) {
        if (err) {
          res.send(err);
        }
        res.json(comments);
      });
    });
  })
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err) {
        res.send(err);
      }
      res.json(comments);
    });
  });


// on routes that end in /comment/:comment_id

router.route('/comment/:comment_id')
  .get(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        res.send(err);
      }
      res.send(comment);
    });
  })
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        res.send(err);
      }

      // update the comment data
      comment.author = req.body.author;
      comment.text = req.body.text;

      // save the updated comment
      comment.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Comment updated!' });
      });
    })
  })
  .delete(function(req, res) {
    Comment.remove({ _id: req.params.comment_id }, function(err) {
      if (err) {
        res.send(err);
      }
      Comment.find(function(err, comments) {
        if (err) {
          res.send(err);
        }
        res.json(comments);
      });
    });
  });


// REGISTER OUR ROUTES
//all of our routes will be prefixed with /api
app.use('/api', router);

app.use('/', express.static(path.join(__dirname, 'public')));


// START THE SERVER
// =======================================================================================================
app.listen(port);
console.log('Server listens on http://localhost ' + port + '...');
