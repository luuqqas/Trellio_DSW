const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Conectando ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/trello_clone', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Configurar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

// Configurar Passport
require('./config/passport')(passport);

// Configurar rotas
const indexRouter = require('./routes/index');
const boardsRouter = require('./routes/boards');
const listsRouter = require('./routes/lists');
const cardsRouter = require('./routes/cards');

app.use('/', indexRouter);
app.use('/boards', boardsRouter);
app.use('/lists', listsRouter);
app.use('/cards', cardsRouter);

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
