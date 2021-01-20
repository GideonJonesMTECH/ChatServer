# ChatServer

Welcome to my ChatServer! To use, open up a Command Line. Go to the directory, and type in "node server", then any number, then a password. The number is your port number, and the password is used for kicking clients

Example: "node server 1099 kickemout"


Then, open up another Terminal, and navigate to the same directory. Type in "node client", and then your port number.

Example: "node client 1099"


Congrats, you've connected one client to the server! To add others, just open up another terminal and continue the steps to joining the first client.
Now they'll be able to talk to each other!


## Commands
/w is whisper. You type in the username of another client and a message, and then you'll send only that user a message.

Example: "/w User64405 Hey, I don't like the other user."


/user changes your username. You type in a new username, and as long as no one else is using it, your username will be updated.

Example: "/user Gideon"


/clientlist returns all the current clients in the chat.

Example: "/clientlist"


/kick will remove another client, as long as you have the correct password. This is where we use the password from the very beginning. You type in the username of the client you want to kick, then the password.

Example: "/kick Gideon kickemout
