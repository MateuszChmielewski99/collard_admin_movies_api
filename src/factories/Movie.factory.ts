import { CreateMovieRequest } from 'collard_admin_models';
import { ObjectId } from 'mongodb';

export const createMovie = (request: CreateMovieRequest): any => {
  return {
    ...request,
    _ts: Date.now(),
    _id: new ObjectId(),
  };
};
