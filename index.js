const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/models');
const jwt = require('jsonwebtoken');
const path = require('path');

// import routes
const userRoute = require('./src/routes/user.routes');
const loginRoute = require('./src/routes/login.routes');

// initialize app
var app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

// get config variables
dotenv.config();

// check if it's connected to our database
db.sequelize
  .authenticate()
  .then(() => {
    // if success
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    // if failed
    console.log('Unable to connect to the database:', err);
  });

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Done adding/update the tables in the database.');
});

// route index url
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SAS API demo.' });
});

//console.log(require("crypto").randomBytes(64).toString("hex"));

const authenticaToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Bearer gfjkghjkghvsdjkghvdkhgskhdgskjvdhgkjhgjkdvghkl

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  // verify if legit
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    console.log(user);
    next();
  });
};

app.use('/public', express.static(path.join(__dirname + '/public/uploads/')));
app.use('/api/v1/login', loginRoute);
// add user routes
app.use('/api/v1/user', authenticaToken, userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
