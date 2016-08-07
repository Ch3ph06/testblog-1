var express = require('express');
var multer = require('multer');
var models = require('./models');
var hbs = require('express-handlebars');

var upload = multer();
var app = express();

app.engine('hbs', hbs({extname: 'hbs', layoutDir: process.cwd() + '\\templates'}));
app.set('view engine', 'hbs');

app.use(upload.single());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/:id', function (req, res) {
  models.Post.findById(req.params.id).then(function (post) {
    if (post) {
      var postdata = {title: post.title, body: post.body};
      res.render('template.hbs', postdata);
      // var response = 'Title: ' + post.title + '\nBody:\n' + post.body + '\nCreatedAt: ' + post.createdAt;
      // res.status(200).send(response).end();
    } else {
      res.status(404).send('not found').end();
    }
  });
});

app.put('/:id', function (req, res) {
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

app.post('/', function (req, res) {
  var post = models.Post.build({
    title: req.body.title,
    body: req.body.body,
    createdAt: Date.now(),
  });
  post.save();
  res.status(201).send('ok').end();
});

app.set('port', process.env.PORT || 3000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
  });
});
