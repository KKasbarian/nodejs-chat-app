const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// const config = require('./.configs');

// const connectionUrl = `mongodb+srv://${config.username}:${config.password}@${config.dbUri}`;
const connectionUrl = `mongodb+srv://${process.env.username}:${process.env.password}@${process.env.dbUri}`;
mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log('DB Connection successful');
});

const MessageModel = mongoose.model('message', {
  name: String,
  text: String,
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messageEndpoint', (request, response) => {
  MessageModel.find({}, (err, allMessages) => {
    if (err) {
      response.sendStatus(500);
    }
    response.send(allMessages);
  });
});

app.post('/messageEndpoint', (request, response) => {
  const messagesObject = new MessageModel(request.body);
  messagesObject.save((err) => {
    if (err) {
      response.sendStatus(500);
    }
  });
  io.emit('messageIncome', request.body);
  response.sendStatus(200);
});

io.on('connection', () => {
  console.log('A user connected');
});

let port = process.env.PORT;
if (port == null || port === '') {
  port = 8000;
}

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
