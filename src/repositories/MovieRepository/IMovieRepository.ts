import { Movie } from 'collard_admin_models';
import { PaginedResult } from '../../internal_types/PaginedResult';
import { IBaseRepository } from '../BaseRepositry/IBaseRepository';

export interface IMovieRepository extends IBaseRepository<Movie> {
  getPagedResult(
    pageSize: number,
    pageNumber: number
  ): Promise<PaginedResult<Movie>[] | undefined>;
}
