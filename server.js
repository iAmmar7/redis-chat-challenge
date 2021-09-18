const app = require('express')();
const http = require('http').createServer(app);

const socket = require('./socket');
const routes = require('./routes');

const PORT = 8080;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Use Routes
app.use('/api', routes);

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

socket(http);
