import { Server } from 'http';
import app from './app';
import subscribeToEvents from './app/events';
import config from './config';
import { RedisClient } from './shared/redis';

async function bootstrap() {
  await RedisClient.connect().then(() => {
    subscribeToEvents();
  });
  const server: Server = app.listen(config.port, () => {
    console.log(`Blog Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.log('un', error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
