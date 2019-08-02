'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
    it('should GET /logs', async () => {
        await app.httpRequest()
            .get('/logs')
            .expect(200);
    });
});