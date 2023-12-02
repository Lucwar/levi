'use strict';

// Define module
module.exports = (helper) => {

  return (key) => {
    return async (req, res, next) => {
      try {

        log({ message: key, level: 'http' }, { description: `${req.method} ${req.baseUrl + req.path}` }, req);

        next();

      } catch (error) {
        helper.lib.logger.log({ level: 'error', message: 'helper.logs.track', payload: { description: `${error.name} - ${error.message}`, additionalData: { key }, error } });
        next(error);
      }
    };
  };
};
