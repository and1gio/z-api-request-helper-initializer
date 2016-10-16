'use strict';

module.exports = {
    run: function (app, next) {

        var ZApiRequestHelper = require('z-api-request-helper');
        app.zApiRequestHelper = {};

        for (var config in app.config.zApiRequestHelper) {
            app.zApiRequestHelper[config] = new ZApiRequestHelper(app.config.zApiRequestHelper[config], app.logger);
        }

        next();
    }
};