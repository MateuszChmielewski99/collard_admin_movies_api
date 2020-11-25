import { Genres } from 'collard_admin_models';
import { EntityReferenceMock } from './EntityReference';
const faker = require('faker');

export class CreateMovieReqestDataMock {
  private request: any;
  constructor() {
    this.request = {
      Name: '',
      Genres: [],
      ImdbLink: '',
      ImdbScore: 0,
      LeadingActors: [],
      Year: 0,
      Director: {},
    };
  }

  withName(length: number) {
    const name = faker.lorem.word(length);
    this.request.Name = name;
    return this;
  }

  withGenres(genres: Genres[]) {
    this.request.Genres = genres;
    return this;
  }

  withImdbLink(link?: string) {
    const url = link ?? faker.internet.url();
    this.request.ImdbLink = url;
    return this;
  }

  withScore(imdbScore?: number) {
    const score = imdbScore ?? faker.random.number();
    this.request.ImdbScore = score;
    return this;
  }

  withLeadingActors(actors: EntityReferenceMock[]) {
    this.request.LeadingActors = actors.map(s => s.getReference());
    return this;
  }

  withYear(year?: number) {
    const data = year ?? faker.date.future(10).getFullYear();
    this.request.Year = data;
    return this;
  }

  withDirector(director: EntityReferenceMock) {
    this.request.Director = director.getReference();
    return this;
  }

  build() {
    return this.request;
  }
}
