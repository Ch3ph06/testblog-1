var express = require('express');
var bodyParser = require('body-parser');
var models = require('./models');
var hbs = require('express-handlebars');

var app = express();

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main.hbs', layoutDir: process.cwd() + '\\layouts', partialdir: process.cwd() + '\\partials'}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index.hbs');
});

app.get('/create', function (req, res) {
  res.render('create.hbs');
});

app.get('/posts', function (req, res) {
  models.Post.findAll().then(function (posts) {
    function getPost (post) {
      return {id: post.id, title: post.title, body: post.body};
    };
    var postsdata = posts.map(getPost);
    res.status(200).render('posts.hbs', {posts: postsdata});
  });
});

app.post('/posts', function (req, res) {
  var post = models.Post.build({
    title: req.body.title,
    body: req.body.body,
    createdAt: Date.now(),
  });
  post.save();
  res.status(201).send('ok').end();
});

app.get('/posts/:id', function (req, res) {
  models.Post.findById(req.params.id).then(function (post) {
    if (post) {
      var postdata = {title: post.title, body: post.body};
      res.status(200).render('post.hbs', postdata);
    } else {
      res.status(404).send('not found').end();
    }
  });
});

app.put('/posts/:id', function (req, res) {
  models.Post.findById(req.params.id).then(function (post) {
    if (post) {
      post.title = req.body.title || post.title;
      post.body = req.body.body || post.body;
      post.save();
      res.status(204).end();
    } else {
      res.status(404).send('not found').end();
    }
  });
});

app.set('port', process.env.PORT || 3000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
  });
});
