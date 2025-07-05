const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares =  jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST' && req.body.id) {
    req.body.id = Number(req.body.id);
  }
  next();
});

server.use(router);
server.listen(3000, () => {
  console.log('✅ JSON Server corriendo en http://localhost:3000');
});
