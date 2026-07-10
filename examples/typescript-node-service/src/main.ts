import { createServer, VERSION } from './adapters/http/server.js';

const port = Number(process.env.PORT ?? 3000);
createServer().listen(port, () => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      service: 'typescript-node-service',
      version: VERSION,
      message: `Escuchando en el puerto ${port}`,
    }),
  );
});
