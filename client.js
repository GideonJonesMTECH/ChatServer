const net = require("net");

let portnumb = process.argv[2];

let client = net.createConnection({ port: portnumb }, () => {
  console.log("You're Connected to the server!");
});
client.setEncoding("utf-8");

process.stdin.pipe(client);

client.on("data", (data) => {
  console.log(data);
});

client.on("close", () => {
  console.log("Connection Closed");
});
