import { injectable } from 'tsyringe';
import { IImageDao } from './IImageDao';
import { Bucket, Storage } from '@google-cloud/storage';

@injectable()
export class GcImageDao implements IImageDao {
  private storage: Storage;
  private bucket: Bucket;
  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOOGLE_PROJECT_ID,
      keyFilename: `${__dirname}/../collard-26e14b4cc98a.json`,
    });
    this.bucket = this.storage.bucket(process.env.GOOGLE_BUCKET_NAME as string);
  }

  public upload(files: Express.Multer.File[]) {
    const urls = [];
    for (const file of files) {
      const blob = this.bucket.file(Date.now() + file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });
      blobStream.on('finish', () => {
        blob.makePublic();
      });
      blobStream.on('error', err => {
        throw err;
      });
      blobStream.end(file.buffer);

      urls.push(this.getFileUrl(blob.name, this.bucket.name));
    }

    return urls;
  }

  async delete(urls: string[]) {
    for (const url of urls) {
      const fileName = this.getFileName(url);
      console.log(fileName);
      try {
        await this.bucket.file(fileName).delete();
      } catch (e) {
        console.log(e.errors);
      }
    }
  }

  private getFileName = (url: string) => {
    return url.replace(
      `https://storage.googleapis.com/${this.bucket.name}/`,
      ''
    );
  };

  private getFileUrl = (fileName: string, bucketName: string) => {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  };
}
