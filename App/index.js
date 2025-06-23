const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
//const account = require('./routes/account');
const Post = require('./models/post');
const accountRoutes = require('./routes/account');

//?
var session = require('express-session');
//?

const app = express();

const port = process.env.PORT || 3000;

//?
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
//?

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000 }));

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', () =>{
    console.log("Successful connection to the database")
});

mongoose.connection.on('error', (err) =>{
    console.log("Not successful connection to the database" + err)
});


app.listen(port, () => {
    console.log("The server was running on the port: " + port)
});

app.get('/', (req, res) => {
Post.find().then( posts => res.json(posts))
});

app.get('/post/:id', (req, res) => {
    let url = req.url.split( '/' )
    id = url[2]
    Post.findById(id).then( post => res.json(post))
});

app.delete('/post/:id',passport.authenticate('jwt',{session:false}), (req, res) => {
    let url = req.url.split( '/' )
    id = url[2]
    Post.deleteOne({ _id: id}).then( () => res.json({ success: true }))
});

app.use('/account', accountRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/(?!api|post|account).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//app.use('/account', account);
