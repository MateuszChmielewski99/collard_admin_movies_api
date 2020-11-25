import { ObjectId } from 'mongodb';
import { inject, injectable } from 'tsyringe';
import { IMovieRepository } from '../../repositories/MovieRepository/IMovieRepository';
import { IMovieService } from './IMovieService';
import { createMovieContract } from '../../factories/MovieContract.factory';
import {
  CreateMovieRequest,
  ListingRequest,
  Movie,
  MovieContract,
  MovieSearchResponse,
  UpdateMovieRequest,
} from 'collard_admin_models';
import { createMovie } from '../../factories/Movie.factory';

@injectable()
export class MovieService implements IMovieService {
  constructor(
    @inject('IMovieRepository') private movieRepository: IMovieRepository
  ) {}

  public async delete(id: string) {
    const movieId: ObjectId = new ObjectId(id);
    await this.movieRepository.deleteOne(movieId);
  }

  public async getById(id: string) {
    const movieId: ObjectId = new ObjectId(id);
    const result = await this.movieRepository.getOne(movieId);

    if (!result) return undefined;

    const movieContract = createMovieContract(result);

    return movieContract;
  }

  public async save(request: CreateMovieRequest) {
    const model: Movie = createMovie(request);
    await this.movieRepository.create(model);
  }

  public async update(request: UpdateMovieRequest) {
    const movieToUpdate = await this.movieRepository.getOne(
      new ObjectId(request.id)
    );

    if (!movieToUpdate) throw new Error('Movie with given id does not exists');

    movieToUpdate.Director = request.Director;
    movieToUpdate.Genres = request.Genres;
    movieToUpdate.ImagesUrls = request.ImagesUrls;
    movieToUpdate.ImdbLink = request.ImdbLink;
    movieToUpdate.ImdbScore = request.ImdbScore;
    movieToUpdate.LeadingActors = request.LeadingActors;
    movieToUpdate.OriginalCountry = request.OriginalCountry;
    movieToUpdate.OriginalLanguage = request.OriginalLanguage;
    movieToUpdate.Year = request.Year;

    await this.movieRepository.update(movieToUpdate);
  }

  public async getPaged(request: ListingRequest) {
    const rawResult = (
      await this.movieRepository.getPagedResult(
        Number.parseInt(request.PageNumber),
        Number.parseInt(request.PageSize)
      )
    )?.pop();

    const result: MovieSearchResponse = {
      Count: rawResult?.Count?.pop()?.count || 0,
      Movies: [],
    };

    result.Movies =
      rawResult?.Result.map<MovieContract>(value =>
        createMovieContract(value)
      ) || [];

    return result;
  }
}
