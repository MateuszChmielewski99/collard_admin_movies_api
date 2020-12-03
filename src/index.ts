import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import { bootstrap } from './container-setup';
import MovieRouter from './controllers/MovieController';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
bootstrap();

const app: Application = express();
app.use(cors({ origin: '*', allowedHeaders: '*', methods: 'any' }));
app.use(bodyParser.json());
app.use('/movie', MovieRouter);

app.get('/', (_req: Request, resp: Response) => {
  return resp.sendStatus(200);
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log('App and running on port ' + port));

export default app;
