const request = require('request');

const ZApiRequestHelper = function (config, logger) {
    if (!config) {
        throw { keyword: 'API_REQUEST_HELPER_CONFIG_MISSING' };
    }
    this.config = config;
    this.logger = logger;
};

let zApiRequestHelper = ZApiRequestHelper.prototype;

zApiRequestHelper.makeRequest = function (type, method, params, headers) {
    let me = this;

    const protocol = me.config.protocol || "http://";
    const host = me.config.host;
    const port = me.config.port;
    const path = me.config.path;

    const apiUrl = protocol.concat(host, ":", port, path, method);

    if (me.config.debug) {
        if (me.logger) {
            me.logger.info(type, apiUrl, params);
        } else {
            console.log(type, apiUrl, params);
        }
    }

    params = { url: apiUrl, json: params };

    if (me.config.timeout) {
        params.timeout = me.config.timeout
    }

    return new Promise((resolve, reject) => {
        if (type !== 'get') {
            request[type](params, (error, response, body) => {
                handleSendResponse(error, response, body, resolve, reject);
            });
        } else {
            request(apiUrl, (error, response, body) => {
                handleSendResponse(error, response, body, resolve, reject);
            });
        }
    });
};

zApiRequestHelper.request = async function (method, params, headers) {
    try {
        return await this.makeRequest('post', method, params, headers);
    } catch (error) {
        throw error;
    }
};

function handleSendResponse(fnError, response, body, resolve, reject) {
    if (fnError) {
        reject([{ keyword: 'CONNECTION_ERROR', error: fnError }]);
    }

    if (!body) {
        reject([{ keyword: 'RESPONSE_BODY_IS_EMPTY' }]);
    }

    if (body.error) {
        reject(body.error);
    }

    resolve(body.result || body);
};

module.exports = ZApiRequestHelper;