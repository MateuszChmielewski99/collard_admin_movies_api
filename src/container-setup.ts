import { MovieService } from './services/MovieService/MovieService';
import { container } from 'tsyringe';
import { MovieRepository } from './repositories/MovieRepository/MovieRepository';

export const bootstrap = () => {
  container.register('IMovieRepository', {
    useClass: MovieRepository,
  });
  container.register('IMovieService', {
    useClass: MovieService,
  });
};
