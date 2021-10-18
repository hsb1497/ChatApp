// MAKE CONNECTION (using 'socket.io', at client side) :
var socket = io.connect('http://localhost:8080/');

//QUERY DOM :
// Querying DOM elements to interact with them (later).
var username = document.getElementById('username'),
    message = document.getElementById('message'),
    output = document.getElementById('output'),
    btn = document.getElementById('send'),
    feedback = document.getElementById('feedback');

// EMIT EVENTS :
// Listens to the 'click' event of the 'btn' and fires a callback function. (This is all Vanilla JS)

function chatMessage() {
    if (message.value === '' || username.value === '') alert('Name or message field is empty.');
    else {
        /*
        * 'socket' is a particular socket that is between this particular client (for which the 'click' event functionality is being executed) and the server.
        * A message (or 'chatMessage' event) is emitted down the WebSocket (to be sent to the server).
        * Data i.e. the 'actual data' to be sent to the server (an 'object' in this case) is emitted with the event.
        */
        socket.emit('chatMessage', {
            message: message.value,
            username: username.value
        });
    }
}

btn.addEventListener('click', chatMessage);

message.addEventListener('keypress', function () {
    socket.emit('typingMessage', username.value);
});


// LISTEN TO EVENTS :
/*
* Over the particular socket (between this client and the server), listening to the 'chatMessage' event and firing a callback function if listened to. 
* The function takes in (receives) the data of the 'chatMessage' event (or messsage) and ouptputs the data to the screen (or document).
*/
socket.on('chatMessage', function (data) {
    message.value = "";
    feedback.innerHTML = "";
    // Outputting data (received from the 'chatMessage' event i.e. which is sent down to all the WebSockets by the server) to the document :
    output.innerHTML += '<p><strong>' + data.username + ':</strong> ' + data.message + '</p>';
    /* 
    * 'innerHTML' gives new HTML to or changes the HTML of an element in the document.
    * '+=' means that new HTML is being added to any previously existing one.
    * 'data' is actually an object (as can be seen in the previous 'addEventListener' method). So, accesing the properties to display values stored against these properties.
    */
});

// After broadcasting 'typingMessage' event data to a client, it is being listened to at the client side. Once it occurs, then 'feedback' element used to display that data.
socket.on('typingMessage', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message ...</em></p>';
});

