import { EntityReference } from 'collard_admin_models';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

export class EntityReferenceMock {
  private er: EntityReference;
  constructor(name?: string) {
    this.er = {
      Id: uuid(),
      Name: name ?? faker.lorem.word(10),
    };
  }

  public getReference() {
    return this.er;
  }
}
