const app = require("./app");
const http = require("http");

const server = http.createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Fine ass is running at Port ${PORT}`);
});
