import { Movie } from 'collard_admin_models';
import { BaseRepository } from '../BaseRepositry/BaseRepository';
import { IMovieRepository } from './IMovieRepository';
import { injectable } from 'tsyringe';
import { PaginedResult } from '../../internal_types/PaginedResult';

@injectable()
export class MovieRepository extends BaseRepository<Movie>
  implements IMovieRepository {
  constructor() {
    super('movies');
  }

  public async getPagedResult(
    pageNumber: number,
    pageSize: number
  ): Promise<PaginedResult<Movie>[] | undefined> {
    const pipeline = [
      {
        $facet: {
          Result: [
            { $skip: pageSize * (pageNumber - 1) },
            { $limit: pageSize },
          ],
          Count: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const result = await this.agregate<PaginedResult<Movie>>(pipeline);
    return result;
  }
}
