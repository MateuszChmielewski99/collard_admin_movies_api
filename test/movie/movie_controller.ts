import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Genres } from 'collard_admin_models';
import server from '../../src';
import { CreateMovieReqestDataMock } from '../data/CreateMovieRequest';
import { EntityReferenceMock } from '../data/EntityReference';

chai.use(chaiHttp);

describe('/POST movie', () => {
  it("it shouldn't create movie with invalid name", (done: jest.DoneCallback) => {
    const request = new CreateMovieReqestDataMock()
      .withName(1)
      .withScore()
      .withYear()
      .withGenres([Genres.Action, Genres.Animation, Genres.Horror])
      .withImdbLink()
      .withLeadingActors([new EntityReferenceMock()])
      .withDirector(new EntityReferenceMock())
      .build();

    chai
      .request(server)
      .post('/movie/create')
      .send(request)
      .end((err, resp) => {
        if (err) done(err);

        expect(resp).to.have.status(400);
        expect(resp).to.be.an('object');
        done();
      });
  });

  it('it should fail with missing genres', (done: jest.DoneCallback) => {
    const request = new CreateMovieReqestDataMock()
      .withImdbLink()
      .withLeadingActors([new EntityReferenceMock()])
      .withName(5)
      .withScore()
      .withYear()
      .build();

    chai
      .request(server)
      .post('/movie/create')
      .send(request)
      .end((err, resp) => {
        if (err) done(err);

        expect(resp).to.have.status(400);
        expect(resp).to.be.an('object');
        done();
      });
  });
});
