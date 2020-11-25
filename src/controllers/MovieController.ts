import { container } from 'tsyringe';
import express, { Router, Response, Request } from 'express';
import { IMovieService } from '../services/MovieService/IMovieService';
import { MovieService } from '../services/MovieService/MovieService';
import {
  CreateMovieRequest,
  ListingRequest,
  UpdateMovieRequest,
  validateCreateMovieRequest,
  validateUpdateMovieRequest,
} from 'collard_admin_models';
import {
  createAjvValidationErrorResponse,
  createValidationErrorResponse,
} from '../factories/ValidationErrorResponse.factory';
import { UpdateMovieHandler } from '../handlers/UpdateMovie.handler';
import { IImageDao } from '../dao/IImageDao';
import { GcImageDao } from '../dao/GcImageDao';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const MovieRouter: Router = express.Router();

const getMovie = async (req: Request, res: Response) => {
  const service: IMovieService = container.resolve(MovieService);

  const id = req.query.id as string;

  if (!id)
    return res
      .status(400)
      .send(createValidationErrorResponse(['Id must be provided']));

  const result = await service.getById(id);

  res.json(result);
};

const deleteMovie = async (req: Request, res: Response) => {
  const service: IMovieService = container.resolve(MovieService);

  const id = req.query.id as string;

  if (!id)
    return res
      .status(400)
      .send(createValidationErrorResponse(['Id must be provided']));

  console.log('http delete triggered');

  await service.delete(id);

  res.send({});
};

const updateMovie = async (req: Request, res: Response) => {
  const handler: UpdateMovieHandler = container.resolve(UpdateMovieHandler);
  const request: UpdateMovieRequest = req.body;

  const result = await handler.handleMovieUpdate(request);

  if (!result.success) {
    return res.status(400).send(result.Errors);
  }

  res.send();
};

const createMovie = async (req: Request, res: Response) => {
  const service: IMovieService = container.resolve(MovieService);

  const request: CreateMovieRequest = req.body;

  const validationResul = validateCreateMovieRequest(request);

  if (!validationResul) {
    const errorResponse = createAjvValidationErrorResponse(
      validateUpdateMovieRequest.errors
    );
    return res.status(400).send(errorResponse);
  }

  await service.save(request);

  res.status(201).send();
};

const getPagedResult = async (req: Request, res: Response) => {
  const service: IMovieService = container.resolve(MovieService);

  const result = await service.getPaged(
    (req.query as unknown) as ListingRequest
  );

  res.json(result);
};

const uploadImage = async (req: Request, res: Response) => {
  const dao: IImageDao = container.resolve(GcImageDao);
  const casted = req.files as Express.Multer.File[];
  try {
    const response = await dao.upload(casted);
    res.send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};

MovieRouter.get('/', getMovie);
MovieRouter.delete('/delete', deleteMovie);
MovieRouter.put('/update', updateMovie);
MovieRouter.post('/create', createMovie);
MovieRouter.get('/page', getPagedResult);
MovieRouter.post('/upload', upload.array('files', 12), uploadImage);

export default MovieRouter;
