import cytoscape from 'cytoscape';
import { User, Promise } from './models';

class World {

  users: User[];
  promises: Promise[];

  constructor(public cy: cytoscape.Core) {
    this.users = new Array<User>();
    this.promises = new Array<Promise>();
  }

  reset() {
    this.users = new Array<User>();
    this.promises = new Array<Promise>();
    this.cy.reset();
    this.cy.pan({ x: 300, y: 140 });
    this.cy.zoom(0.015);
    this.cy.remove(this.cy.nodes());
  }

  addPromise(from_name: string, to_name: string,
    amt: number, currency: string) {

    const fromUser = this.ensureUserByName(from_name);
    const toUser = this.ensureUserByName(to_name);
    const promise = new Promise(fromUser, toUser, amt, currency);

    const edge = this.cy.add({
      group: 'edges',
      data: {
        id: promise.id,
        source: fromUser.id,
        target: toUser.id,
        type: 1,
        amt: promise.amt,
      }
    });
    promise.edge = edge;
    this.promises.push(promise);
    return promise;
  }

  addMutual(from_name: string, to_name: string,
    amt: number, currency: string) {

    const fromUser = this.ensureUserByName(from_name);
    const toUser = this.ensureUserByName(to_name);
    const promise1 = new Promise(fromUser, toUser, amt, currency);
    const promise2 = new Promise(toUser, fromUser, amt, currency);

    const edge1 = this.cy.add({
      group: 'edges',
      data: {
        id: promise1.id,
        source: fromUser.id,
        target: toUser.id,
        type: 2
      }
    });
    promise1.edge = edge1;
    this.promises.push(promise1);

    const edge2 = this.cy.add({
      group: 'edges',
      data: {
        id: promise2.id,
        source: toUser.id,
        target: fromUser.id,
        type: 2
      }
    });
    promise2.edge = edge2;
    this.promises.push(promise2);

    return [promise1, promise2];
  }

  addUser(name: string) {

    const user = new User(name);

    const node = this.cy.add({
      group: 'nodes',
      data: {
        name: user.name,
        id: user.id,

      },
      position: { x: 0, y: 0 }
    });
    user.node = node;
    this.users.push(user);
    return user;
  }

  reciprocity(users: string[]) {

  }

  userByName(name: string): User | undefined {
    return this.users.find(x => ('' + x.name).toLowerCase() === name.toLowerCase());
  }

  ensureUserByName(name: string): User {
    var user = this.userByName(name);
    if (user) {
      return user;
    }
    else {
      return this.addUser(name);
    }
  }

  userById(id: string): User | undefined {
    return this.users.find(x => x.id.toLowerCase() === id.toLowerCase());
  }

  // stooges() {
  //   return [
  //     new User('Miles'),
  //     new User('Nico'),
  //     new User('Anna')
  //   ];
  // }

  //  randomGenerate(totalUsers, totalEdges) {
  //   const users = [];
  //   for (let i = 0; i < totalUsers; i++) {
  //     let user = new User(rn({seed: Math.random()}));
  //     users[i] = user;
  //   }

  //   for (let j = 0; j < totalEdges; j++) {
  //     let userFromNum = Math.floor(Math.random() * totalUsers);
  //     let userToNum = Math.floor(Math.random() * totalUsers);
  //     if (userFromNum === userToNum) {
  //       j--;
  //       continue;
  //     }
  //     let debt = Math.floor(Math.random() * 100);
  //     users[userFromNum].oweUser(users[userToNum], debt);
  //   }
  //   return users;
  // }
}

export default World;