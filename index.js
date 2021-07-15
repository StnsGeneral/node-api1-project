require('dotenv').config();
const server = require('./api/server');

const port = process.env.PORT || 5000;

// START YOUR SERVER HERE
server.listen(port, () => {
  console.log(
    `\n --- Users API Server started on http://localhost:${port} ---`
  );
});
