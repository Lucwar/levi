'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Log to console and save in database
   *
   * @param {Object} params - Log config
   * @param {string} [params.level] - Log Level ("error": 0, "warn": 1, "info": 2, http: 3, verbose: 4, debug: 5, silly: 6). Default: "info"
   * @param {string} [params.message] - Key to identify log type (helper/cron/model names)
   * @param {Object} [payload] - Metadata saved into database
   * @param {string} [payload.description] - Additional Info
   * @param {Object} [req] - EndPoint Req
   */
  return (params = {}, payload = {}, req) => {
    try {
      
      if (!params.level) params.level = 'info';
      if (!params.message) params.message = 'no-key';

      if (payload.name && payload.message && !payload.description) payload.description = `${payload.name} - ${payload.message}`;
      if (payload.error && payload.error.name && payload.error.message && !payload.description) payload.description = `${payload.error.name} - ${payload.error.message}`;

      const { name, message, stack, error, status, description, ...additionalData } = payload;

      payload.additionalData = additionalData;

      if (req) {

        if (req.user) payload.user = {
          id: req.user._id,
          roles: req.user.roles
        }

        payload.request = {
          method: req.method,
          endPoint: req.baseUrl + req.path,
          url: req.protocol + '://' + req.get('host') + decodeURI(req.originalUrl),
          params: req.params,
          query: req.query,
          body: req.body,
          headers: {
            'user-agent': req.headers['user-agent']
          }
        };
      }

      helper.lib.logger.log({ ...params, payload });

    } catch (error) {
      helper.lib.logger.log({ level: 'error', message: 'helper.logs.log', payload: { description: `${error.name} - ${error.message}`, additionalData: { ...params, payload }, error } });
    }
  };
};
