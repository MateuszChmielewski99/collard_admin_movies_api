export interface IImageDao {
  upload(name: Express.Multer.File[]): string[];
  delete(url: string[]): Promise<void>;
}
