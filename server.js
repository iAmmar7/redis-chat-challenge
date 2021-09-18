const express = require('express');

const app = express();
const http = require('http').createServer(app);

const socket = require('./socket');
const routes = require('./routes');

const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use Routes
app.use('/api', routes);

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

socket(http);
