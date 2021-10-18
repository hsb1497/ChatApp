var express = require('express'); // to tell 'JS' that 'Express' is required (for the application).

// APP SETUP :
var app = express(); // The variable 'express' is actually a function expression. 'express()' is calling or invoking the function stored inside the variable 'express'.

// var http = require('http').createServer(app); // Using built-in 'http' module (in Node.js) to create a server.

// 'socket.io' required to use 'socket.io' (or WebSockets) at the server side.
var socket = require('socket.io');


// Creating a server :

/*
const PORT = 8000 || process.env.PORT; // defining the 'port'.
// Server built by making use of the HTTP module:
var server = http.listen(8080, function () {
    console.log('Listening to requests on port number 8080.')
});
*/

// Server built using 'express' (it too makes use of 'HTTP' module under the hood).
var server = app.listen(8080, function () {
    console.log('Listening to requests on port number 8080.')
}); // Listening to requests on a specific port number and firing a callback function.

// STATIC FILES :
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));

// SOCKET SETUP (at the server side) :
var io = socket(server); // setting up 'socket.io' over the server.

// To listen to the 'connection' event. When the connnection (with the server by a client or a browser) is made, a callback function with the 'particular socket instance' as a parameter is fired :-
io.on('connection', function (socket) {
    // The following all get executed when the connection is established.
    console.log('Socket connection is made', socket.id);

    // socket.emit('welcomeMessage', 'Welcome! to the CHAT APP.');

    socket.on('chatMessage', function (data) {
        /*
        (At the server side) Over the particular socket (which is there between the particular client and the server after the client has connected with the server), 
        listening to the 'chatMessage' event (sent by the client to the server) over that WebSocket and firing a callback function upon occurring of the event. 
        Also, taking in (receiving) the 'data' associated with the 'chatMessage' event (the object data) while firing the callback fn.:-
        */

        // Once the data (sent by the client) is received by the server, it now has to be sent to the rest of the clients connected with the server over all the WebScokets.
        io.sockets.emit('chatMessage', data);
        // 'io.sockets' refers to the collection of all the sockets connected with the server at that time. 
        // 'chatMessage' event is emitted down all the WebSockets and the data emitted with the event (the second parameter) is the same data as the one received by the server from the current client.
    });

    socket.on('typingMessage', function (data) {
        // Broadcating a message (or event) :-
        socket.broadcast.emit('typingMessage', data); // will broadcast the message or event to every other client (connected with the server) except the particular client or except over the particular socket - 'socket' (the one also passed as the parameter of 'io.on()' method) which originally emitted the event / message. 
    })
});