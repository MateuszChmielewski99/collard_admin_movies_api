import {
  UpdateMovieRequest,
  validateUpdateMovieRequest,
} from 'collard_admin_models';
import { GcImageDao } from '../dao/GcImageDao';
import { IImageDao } from '../dao/IImageDao';
import { container, inject, injectable } from 'tsyringe';
import { createAjvValidationErrorResponse } from '../factories/ValidationErrorResponse.factory';
import { OperationRersult } from '../internal_types/OperationResult';
import { IMovieService } from '../services/MovieService/IMovieService';

@injectable()
export class UpdateMovieHandler {
  constructor(@inject('IMovieService') private service: IMovieService) {}

  public async handleMovieUpdate(
    request: UpdateMovieRequest
  ): Promise<OperationRersult> {
    const validationResul = validateUpdateMovieRequest(request);
    const imageDao: IImageDao = container.resolve(GcImageDao);

    const movie = await this.service.getById(request.id);

    const filesToDelete = movie?.ImagesUrls?.filter(
      s => !request.ImagesUrls?.includes(s)
    );

    if (filesToDelete) await imageDao.delete(filesToDelete);

    if (!validationResul) {
      const errorResponse = createAjvValidationErrorResponse(
        validateUpdateMovieRequest.errors
      );

      return { success: false, ...errorResponse };
    }

    try {
      await this.service.update(request);
    } catch (err) {
      return { success: false, Errors: [err] };
    }

    return { success: true, Errors: [] };
  }
}
