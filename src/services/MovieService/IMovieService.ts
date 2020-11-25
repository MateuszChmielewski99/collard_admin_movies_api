import {
  CreateMovieRequest,
  ListingRequest,
  MovieContract,
  MovieSearchResponse,
  UpdateMovieRequest,
} from 'collard_admin_models';

export interface IMovieService {
  save(movie: CreateMovieRequest): Promise<void>;
  delete(id: string): Promise<void>;
  update(request: UpdateMovieRequest): Promise<void>;
  getById(id: string): Promise<MovieContract | undefined>;
  getPaged(request: ListingRequest): Promise<MovieSearchResponse>;
}
