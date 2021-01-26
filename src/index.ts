// ENABLE .config/ ONLY for LOCAL environment
import './config';

import http from 'http';

import { app } from './app';
import { port } from './env';
import { server } from './server';

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: false,
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
