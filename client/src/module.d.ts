declare namespace NodeJS {
  interface Global {
    fetch: jest.Mock;
  }
}
