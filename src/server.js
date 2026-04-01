const http = require('http');
const app = require('./app');
const initSocket = require('./socket');
const { PORT } = require('./config');

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
