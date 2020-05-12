const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

// const connectionUrl = 'mongoDB Link insert here';

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let messagesStorage = [];

app.get('/messageEndpoint', (request, response) => {
  response.send(messagesStorage);
});

app.post('/messageEndpoint', (request, response) => {
  messagesStorage.push(request.body);
  console.log(request.body);
  io.emit('messageIncome', request.body);
  response.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

// http.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

let port = process.env.PORT;
if (port == null || port == '') {
  port = 8000;
}
app.listen(port);
