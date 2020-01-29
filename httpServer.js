const http = require("http");
const {app} = require('./handlers');

// const requestListener = function(req, res) {
//   console.log(req.method, req.url);
//   if (req.method === "GET" && req.url === "/guestBook.html") {
//     return serveGuestBook(req, res);
//   }
//   if (req.method === "POST" && req.url === "/guestBook.html") {
//     return servePost(req, res);
//   }
//   if (req.method === "GET" && req.url === "/") {
//     return serveHomePage(req, res);
//   }
//   if (req.method === "GET") {
//     return serveStaticFile(req, res);
//   }
//   defaultResponse(req, res);
// };

const server = new http.Server(app.serve.bind(app));

server.listen(4000, () => {
  console.log("listening started");
});