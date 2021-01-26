import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

export const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000']);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  );
  next();
});

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const errorHandler = (err: any, _req: any, res: any, next: any): any => {
  if (res.headersSent) {
    return next(err);
  }
  const { status } = err;
  res.status(status).json(err);
};
app.use(errorHandler);
