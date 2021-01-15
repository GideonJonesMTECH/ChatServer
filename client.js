const net = require("net");
const { exit } = require("process");

let client = net.createConnection({ port: 1099 }, () => {
  console.log("You're Connected to the server!");
});
client.setEncoding("utf-8");
client.on("data", (data) => {
  console.log(data);
});
process.stdin.pipe(client);
//pipe events to the client
