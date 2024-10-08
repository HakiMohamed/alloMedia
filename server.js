//server.js
const app = require("./app");
const http = require("http");

const port = process.env.APP_PORT; 

app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
