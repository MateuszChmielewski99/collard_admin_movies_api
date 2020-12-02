import * as dotenv from 'dotenv';
import {
  MongoClient,
  FilterQuery,
  CollectionAggregationOptions,
  ObjectId,
} from 'mongodb';

export class BaseRepository<T extends { _id?: string }> {
  private collectionName: string = '';
  private connectionUri = '';
  protected client: MongoClient;

  constructor(collectionName: string) {
    this.connectionUri = this.getConnectionUri();
    this.collectionName = collectionName;

    this.client = new MongoClient(this.connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      native_parser: true,
      keepAlive: true,
    });
  }

  public async create(entity: T) {
    try {
      await this.client.connect();

      const db = this.client.db('Collard');
      await db.collection(this.collectionName).insertOne(entity);
    } catch (e) {
      console.error(e);
      throw e;
    }
    await this.client.close();
  }

  public async update(entity: T) {
    try {
      await this.client.connect();

      const db = this.client.db();
      const { _id, ...rest } = entity;
      await db
        .collection(this.collectionName)
        .updateOne({ _id }, { $set: rest }, { upsert: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
    await this.client.close();
  }

  public async getOne(id: ObjectId) {
    let result: T | null = undefined || null;
    try {
      await this.client.connect();
      const db = this.client.db();
      result = await db.collection(this.collectionName).findOne<T>({ _id: id });
    } catch (e) {
      console.error(e);
    }

    return result;
  }

  public async deleteOne(id: ObjectId) {
    try {
      await this.client.connect();
      const db = this.client.db();
      await db.collection(this.collectionName).deleteOne({ _id: id });
    } catch (e) {
      console.error(e);
    }

    await this.client.close();
  }

  public async getByQuery(query: FilterQuery<T>) {
    let result: any[] = [];
    try {
      const db = this.client.db();
      result = await db
        .collection(this.collectionName)
        .find(query)
        .toArray();
    } catch (e) {
      console.error(e);
    }

    await this.client.close();
    return result;
  }

  public async insertMany(data: T[]) {
    try {
      await this.client.connect();
      const db = this.client.db('Collard');
      await db.collection(this.collectionName).insertMany(data);
    } catch (e) {
      console.error(e);
    }
    await this.client.close();
  }

  public async agregate<U>(
    pipeline?: object[] | undefined,
    options?: CollectionAggregationOptions | undefined
  ): Promise<U[] | undefined> {
    let result: U[] | undefined = undefined;
    try {
      await this.client.connect();
      const db = this.client.db();
      result = await db
        .collection(this.collectionName)
        .aggregate(pipeline, options)
        .toArray();
    } catch (e) {
      console.error(e);
    }

    await this.client.close();
    return result;
  }

  private getConnectionUri = () => {
    const connectionUri =
      'mongodb+srv://BonuzAdmin:<password>@collard.1i3y6.mongodb.net/<dbname>?retryWrites=true&w=majority';
    return connectionUri
      .replace('<password>', process.env.MONGO_PASSWORD as string)
      .replace('<dbname>', process.env.DBNAME as string);
  };
}
