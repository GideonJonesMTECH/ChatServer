const net = require("net");

let sockets = [];
const svrport = process.argv[2];
const password = process.argv[3];
let server = net
  .createServer((socket) => {
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
      `We recommend changing your username by typing in "/user " and then your new username.\n`
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

        for (let i = 0; i < sockets.length; i++) {
          if (sockets[i].userName == whisperTo) {
            sockets[i].write(
              `${socket.userName} whispered to you: "${message}".`
            );
            return;
          }
        }
      } else if (data[0] == "user") {
        let prevUsername = socket.userName;
        let newUsername = data[1];
        //if another socket has that username, decline the call
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
        for (let i = 0; i < sockets.length; i++) {
          if (removeName == sockets[i].userName) {
            if (passwordAttempt === password) {
              sockets[i].write(`You have been kicked from the server.`);
              sockets[i].emit("end");
              return;
            }
          }
        }
      } else if (data[0] == "clientlist") {
        socket.write(`CURRENT USERS: \n`);
        for (let i = 0; i < sockets.length; i++) {
          if (sockets[i] != socket) socket.write(`${sockets[i].userName} \n`);
          else if (sockets[i] == socket)
            socket.write(`${socket.userName} (You) \n`);
        }
      } else {
        socket.write(
          `I'm sorry, your command ${data} isn't one of the options. \n The valid commands are "/w", "/username","/kick", and "/clientlist".`
        );
      }
    });
    socket.emit("command", "/clientlist");
    socket.on("error", (err) => {
      if (err) console.log(err);
    });
  })
  .listen(svrport);
console.log(`Server Created at ${svrport} \n`);
