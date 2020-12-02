export interface IImageDao {
  upload(name: Express.Multer.File[]): Promise<unknown[]>;
  delete(url: string[]): Promise<void>;
}
