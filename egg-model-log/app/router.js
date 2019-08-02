'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/generate', controller.home.generate);


    router.get('/users', controller.user.list);
    router.post('/users', controller.user.add);
    router.put('/users/:userId', controller.user.edit);

    router.get('/logs', controller.log.list);
};