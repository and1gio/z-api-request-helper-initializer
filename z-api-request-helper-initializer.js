'use strict';

module.exports = {
    run: function (app, next) {

        let ZApiRequestHelper = require('z-api-request-helper');
        app.zApiRequestHelper = {};

        for (let config in app.config.zApiRequestHelper) {
            app.zApiRequestHelper[config] = new ZApiRequestHelper(app.config.zApiRequestHelper[config], app.logger);
        }

        next();
    }
};