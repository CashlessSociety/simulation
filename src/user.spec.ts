import { User } from './models';

describe('User', () => {
    it('should log when  debt added', () => {
        const user = new User('larry');
        const otherUser = new User('moe');
        spyOn(console, 'log');

        //user.oweUser(otherUser, new Ping(user, otherUser, 2));

        expect(console.log).toHaveBeenCalled();
    });
});
