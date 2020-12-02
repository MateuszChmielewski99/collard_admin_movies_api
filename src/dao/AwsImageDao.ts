import { injectable } from 'tsyringe';
import { IImageDao } from './IImageDao';
import S3 from 'aws-s3';

@injectable()
export class AwsImageDao implements IImageDao {
  private s3Client;
  constructor() {
    const config = {
      bucketName: 'collardimages',
      region: 'us-east-2',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey:process.env.AWS_SECRET,
    };
    this.s3Client = new S3(config);
  }
  async upload(files: Express.Multer.File[]): Promise<unknown[]> {
    const promises: Promise<unknown>[] = [];

    files.forEach(file => {
      promises.push(this.s3Client.uploadFile(file, file.filename));
    });

    return promises;
  }

  async delete(urls: string[]): Promise<void> {
    for (const url of urls) {
        await this.s3Client.deleteFile(url);
    }
  }
}
