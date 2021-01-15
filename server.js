const net = require("net");

let sockets = [];
var svrport = 1099;
let server = net
  .createServer((socket) => {
    console.log(`Connected: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.write("Welcome to the chat!\n");
    for (let i = 0; i < sockets.length; i++)
      if (sockets[i] != socket) {
        sockets[i].write(`${socket.remotePort} joined the chat!\n`);
      }
    sockets.push(socket);

    socket.setEncoding("utf-8");
    socket.on("data", (data) => {
      data = data.trim();
      if (data == "") {
        return;
      } else if (data === "exit") {
        console.log(
          `exit command received: ${socket.remoteAddress}:${socket.remotePort}\n`
        );
        socket.emit("end");
        return;
      }
      for (let i = 0; i < sockets.length; i++)
        if (sockets[i] != socket) {
          sockets[i].write(`${socket.remotePort}: ${data}`);
        }
    });
    socket.on("end", () => {
      console.log(
        `Disconnected: ${socket.remoteAddress}:${socket.remotePort}\n`
      );
      console.log(socket);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i] != socket) {
          sockets[i].write(`${socket.remotePort} Disconnected.`);
        }
      }
      socket.write("See you later!");
      let idx = sockets.indexOf(socket);
      if (idx != -1) {
        delete sockets[idx];
      }
    });
    socket.on("error", (err) => {
      if (err) console.log(err);
    });
  })
  .listen(svrport);
console.log(`Server Created at ${svrport} \n`);
