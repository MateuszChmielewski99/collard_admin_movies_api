import { Movie } from 'collard_admin_models';
import { BaseRepository } from '../../repositories/BaseRepositry/BaseRepository';
import { readFromFile } from '../read-from-files';

type BaseMovie = Omit<Movie | '_id', '_ts'>;

const mapToEntity = (movie: BaseMovie) => {
  return {
    ...movie,
    _ts: Date.now(),
  };
};

const movieSeed = async () => {
  const repo = new BaseRepository<BaseMovie>('movies');

  readFromFile<BaseMovie>(
    'src/seed/movie/movies.json',
    async (data: BaseMovie[]) => {
      await repo.insertMany(data.map(mapToEntity));
    }
  );
};

(async () => await movieSeed())();
