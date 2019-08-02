'use strict';

const { app, assert } = require('egg-mock/bootstrap');
let user;
const addBody = { nickName: 'first', userImcode: 1111, email: 'first@henheoji.com' };
const editBody = { nickName: 'f-sencond', userImcode: 2222, email: 'f-sencond@henheoji.com' };
describe('test/app/controller/home.test.js', () => {
    it('should POST /users', async () => {
        app.mockCsrf();
        const res = await app.httpRequest()
            .post('/users')
            .send(addBody)
            .expect(200);
        user = res.body;
    });
    it('should put /users/:userId', async () => {
        app.mockCsrf();
        await app.httpRequest()
            .put(`/users/${user.userId}`)
            .send(editBody)
            .expect(200);
    });
    it('should get /users', async () => {
        await app.httpRequest()
            .get('/users')
            .expect(200);
    })
});