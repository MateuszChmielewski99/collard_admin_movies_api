import 'reflect-metadata';
import express, { Application } from 'express';
import { bootstrap } from './container-setup';
import MovieRouter from './controllers/MovieController';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
bootstrap();

const app: Application = express();
app.use(bodyParser.json());
app.use('/movie', MovieRouter);

app.listen(5050, () => console.log('App and running'));

export default app;
