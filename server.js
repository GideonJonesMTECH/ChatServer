const net = require("net");

let sockets = [];
const svrport = process.argv[2];
const password = process.argv[3];

let server = net.createServer((socket) => {
  socket.userName = `User${socket.remotePort}`;
  console.log(`Connected: ${socket.userName}`);
  socket.write("Welcome to the chat!\n");
  for (let i = 0; i < sockets.length; i++)
    if (sockets[i] != socket) {
      sockets[i].write(`${socket.userName} joined the chat!\n`);
    }
  sockets.push(socket);
  socket.setEncoding("utf-8");
  socket.write(
    `We recommend changing your username by typing in "/user " and then your new username.\nYou can find the other commands by typing in "/help".\n`
  );
  socket.write(`Your username right now is ${socket.userName}\n\n`);

  socket.on("data", (data) => {
    data = data.trim();
    if (data == "") {
      return;
    } else if (data === "exit") {
      console.log(`exit command received: ${socket.userName}\n`);
      socket.emit("end");
      return;
    } else if (data[0] == "/") {
      socket.emit("command", data);
    } else {
      for (let i = 0; i < sockets.length; i++)
        if (sockets[i] != socket) {
          sockets[i].write(`${socket.userName}: ${data}`);
        }
    }
  });
  socket.on("end", () => {
    console.log(`Disconnected: ${socket.userName}\n`);
    console.log(`Pre Deletion: ${sockets.length}`);
    let idx = sockets.indexOf(socket);
    sockets = sockets.filter((tempSock) => tempSock != socket);
    socket.destroy();
    console.log(`After Deletion: ${sockets.length}`);
    for (let i = 0; i < sockets.length; i++) {
      sockets[i].write(`${socket.userName} Disconnected.`);
    }
  });
  socket.on("command", (data) => {
    data = data.slice(1).split(" ");
    if (data[0] == "w") {
      data.shift();
      let whisperTo = data.shift();
      let message = data.join(" ");
      if (whisperTo == socket.userName) {
        socket.write(`You can't whisper to yourself.`);
        return;
      }
      if (message == "" || message == undefined) {
        socket.write("You can't whisper without a message!");
        return;
      }

      for (let i = 0; i < sockets.length; i++) {
        if (whisperTo == sockets[i].userName) {
          sockets[i].write(`${socket.userName} whispered to you: "${message}"`);
          return;
        }
      }
      socket.write(`Sorry, there isn't a user named "${whisperTo}"`);
    } else if (data[0] == "user") {
      let prevUsername = socket.userName;
      let newUsername = data[1];
      if (newUsername == undefined || newUsername == "") {
        socket.write(`Please include a new username. `);
        return;
      }
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].userName == newUsername) {
          socket.write(
            "Someone else is using that username. Please choose another."
          );
          return;
        }
      }
      socket.userName = newUsername;

      socket.write(`Your username is now ${socket.userName}`);
      console.log(`${prevUsername} changed their name to ${socket.userName}`);
      for (let i = 0; i < sockets.length; i++)
        if (sockets[i] != socket) {
          sockets[i].write(
            `${prevUsername} changed their name to ${socket.userName}`
          );
        }
    } else if (data[0] == "kick") {
      removeName = data[1];
      passwordAttempt = data[2];
      if (removeName == socket.userName) {
        socket.write(`You can't kick yourself.`);
        return;
      } else if (removeName == undefined || removeName == "") {
        socket.write(`Please include someone to kick. `);
        return;
      }
      for (let i = 0; i < sockets.length; i++) {
        if (removeName == sockets[i].userName) {
          if (passwordAttempt === password) {
            sockets[i].write(`You have been kicked from the server.`);
            sockets[i].emit("end");
            return;
          } else {
            socket.write(`Your password was incorrect.`);
            return;
          }
        }
      }
      socket.write(`Sorry, there isn't a user named "${removeName}"`);
    } else if (data[0] == "clientlist") {
      socket.write(`CURRENT USERS: \n`);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i] != socket) socket.write(`${sockets[i].userName} \n`);
        else if (sockets[i] == socket)
          socket.write(`${socket.userName} (You) \n`);
      }
    } else if (data[0] == "help") {
      socket.write(
        "COMMANDS: \n/w <username> <message>  || Whisper ||  Talk only to one other Client. \n"
      );
      socket.write(
        "/user <newUsername>  || Username ||  Change your username to the whole chat. \n"
      );
      socket.write(
        "/kick <username> <password>  || Kick ||  Kick out one of the other clients. You must include the password that was provided when the server was created. \n"
      );
      socket.write(
        "/clientlist  || Client List ||  Get a list of all the other users in the chat. \n"
      );
      socket.write(
        "/help  || Help ||  Get a list of all the commands you can run (It's this list right now!) \n\n"
      );
    } else {
      socket.write(
        `I'm sorry, your command ${data} isn't one of the options. \n Type in "/help" to see the valid commands.`
      );
    }
  });
  socket.emit("command", "/clientlist");
  socket.on("error", (err) => {
    if (err) console.log(err);
  });
});

if (svrport !== undefined || password !== undefined) {
  server.listen(svrport);
  console.log(`Server Created at ${svrport} \n`);
  console.log(`Port: ${svrport}`);
  console.log(`Password: ${password}`);
} else {
  console.log(
    "I'm sorry, but when making a server, please include the server port, and the password for kicking clients."
  );
  return;
}
