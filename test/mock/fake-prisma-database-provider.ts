export class FakePrismaDatabaseProvider {
  challenge = {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  };
}
