function generateRandomString(length) {
  if (length > 33) length = 33;
  return Math.random().toString(36).substring(2, length + 2);
}

class User {
  id: string;
  node: any;
  constructor(public name: string) {
    this.id = generateRandomString(4);
  }
}

class Promise {
  id: string;
  edge: any;
  constructor(
    public from: User,
    public to: User,
    public amt: number,
    public currency: string) {
    this.id = generateRandomString(4);
  }
}

class TransactionRecord {
    id: string;
    constructor(
      public timeStep: number,
      public from: string,
      public to: string,
      public amt: number) {
      this.id = generateRandomString(8);
    }
}

class TransactionNode {
    id: string;
    constructor(public name: string) {
      this.id = generateRandomString(8);
    }
}

export { User, Promise, TransactionRecord, TransactionNode};