import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import socket_io from 'socket.io';

require('dotenv').config();

const app = express();

const port: number = Number(process.env.APP_PORT) || 3000;

const server = http.createServer(app);
const io = socket_io.listen(server);

// app.use('/api/profile',express.static(path.join(__dirname + './../../../front/upload/avatar')));
app.use(express.static(path.join(__dirname + './../../../front')));
app.use(express.static(path.join(__dirname + './../../../front/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', require('./routs'));

// app.use('*', (req, res) => {
//   const file = path.resolve(process.cwd(), '../front', 'build', 'index.html')
//   res.sendFile(file)
// });

server.listen(port, () => {
  console.log('Server start. Port ', port)
});

const connectUsers = {}
const historyMessages = {}

io.on('connection', (socket) => {
    socket.on('users:connect', function (data) {
        const user = { ...data, socketId: socket.id,  activeRoom: null }

        connectUsers[socket.id] = user;
        socket.emit('users:list', Object.values(connectUsers))
        socket.broadcast.emit('users:add', user)
    })
    socket.on('message:add', function (data) {
        socket.emit('message:add', data)
        socket.broadcast.to(data.roomId).emit('message:add', data)
        addMessage(data.senderId, data.recipientId, data)
        addMessage(data.recipientId, data.senderId, data)
    })
    socket.on('disconnect', () => {
        delete connectUsers[socket.id]

        socket.broadcast.emit('users:leave', socket.id)
    })
    socket.on('message:history', function(data) {
        if (historyMessages[data.userId] && historyMessages[data.userId][data.recipientId]) {
            socket.emit('message:history', historyMessages[data.userId][data.recipientId])
        }
    })
})

function addMessage(senderId, recipientId, data) {
    if (historyMessages[senderId]) {
        if (historyMessages[senderId][recipientId]) {
            historyMessages[senderId][recipientId].push(data)
        } else {
            historyMessages[senderId][recipientId] = []
            historyMessages[senderId][recipientId].push(data)
        }
    } else {
        historyMessages[senderId] = {}
        historyMessages[senderId][recipientId] = []
        historyMessages[senderId][recipientId].push(data)
    }
}
