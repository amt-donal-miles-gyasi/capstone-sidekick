import app from './app';

const port = +process.env.SERVER_PORT || 8080;

process.env.NODE_ENV === 'development'
  ? app.listen(port, '0.0.0.0')
  : app.listen();
