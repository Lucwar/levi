'use strict';

// Define module
module.exports = (helper) => {

  return (roles = ['anonymous']) => {
    return async (req, res, next) => {
      try {
        // console.log("AUTH =>> ", req.body, req.query.token, req.headers['x-access-token'])
        // Define context user
        let user = null;

        // Define token
        let token = req.headers['x-access-token'] || req.body.token || req.query.token || null;

        if (!token) return next(helper.lib.httpError(401, 'ERROR.A0: No se encuentra token'));

        try {
          user = helper.lib.jsonwebtoken.verify(token, helper.settings.token.access);
        } catch (error) {
          return next(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));
        }

        if (!user) return next(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));

        for (const Role of helper.settings.token.roles) {
          if (user.roles.some(role => Role.values.includes(role))) req.user = await global.modules.v1[Role.model].model.findOne({ _id: user.id });
        }

        if (!req.user) return next(helper.lib.httpError(401, 'ERROR.A2: Su usuario no se encuentra registrado'));
        if (!req.user.enabled || req.user.accountDeleted) return next(helper.lib.httpError(401, 'ERROR.A3: Su usuario ha sido deshabilitado'));

        if (!roles.some(role => ['anonymous', ...req.user.roles].includes(role))) return next(helper.lib.httpError(403, 'ERROR.A4: Acceso denegado'));

        // console.log("AUTH USER =>> ", JSON.stringify(req.user._id))

        next();

      } catch (error) {
        log({ level: 'error', message: 'helper.security.auth' }, error);
        next(error);
      }
    };
  };
};
