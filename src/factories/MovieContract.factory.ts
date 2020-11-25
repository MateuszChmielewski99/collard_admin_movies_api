import { Movie, MovieContract } from 'collard_admin_models';

export const createMovieContract = (movie: Movie): MovieContract => {
  const { _ts, _id, ...rest } = movie;

  return {
    id: _id,
    ...rest,
  };
};
