const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.post("/form/mailing", (req, res) => {
  const q = req.query;
  
  res.status(200);
  res.jsonp({ id: 12});
  return
});
server.post("/order/", (req, res) => {
  const q = req.query;
  res.status(200);
  res.jsonp({ id: 12});
});
// server.get("/authorized", (req, res) => {
//   res.status(200);
//   res.json({
//     id: "12",
//   });
// });


server.use(router);
server.listen(3002, () => {
  console.log("JSON Server is running");
});
// In this example we simulate a server side error response
