'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise((resolve, reject) => {
      try {

        const { password, verifyPassword, passwordVerify } = req.body;

        if (verifyPassword && verifyPassword !== password) return reject(helper.lib.httpError(404, 'ERROR.CU0: Las contraseñas no coinciden'));
        if (passwordVerify && passwordVerify !== password) return reject(helper.lib.httpError(404, 'ERROR.CU0: Las contraseñas no coinciden'));

        // Hash password
        if (password) req.body.password = helper.lib.bcrypt.hashSync(password, helper.settings.crypto.saltRounds);

        model.create(req.body)
          .then((result) => {

            // Create token
            let data = result.toJSON();
            data.accessToken = helper.lib.jsonwebtoken.sign({ roles: data.roles, id: data.id }, helper.settings.token.access, { expiresIn: helper.settings.token.expiresIn.access });
            data.refreshToken = global.helpers.security.decrypt(data.id, 'refreshToken', data.refreshToken);

            helper.lib.bouncer.duplicates.reset(req);

            resolve({ data });
          })
          .catch((error) => {
            console.log(error);
            let message = error.message || 'ERROR.0: Ocurrió un error inesperado';

            if (error.errors.dni && error.errors.dni.kind == 'unique') message = "ERROR.CU1: DNI duplicado";
            if (error.errors.emailAddress && error.errors.emailAddress.kind == 'unique') message = "ERROR.CU2: Email duplicado";
            if (error.errors.username && error.errors.username.kind == 'unique') message = "ERROR.CU2: Email duplicado";
            if (error.errors.phoneNumber && error.errors.phoneNumber.kind == 'unique') message = "ERROR.CU3: Ya existe un usuario con ese número de teléfono";
            // if (error.errors.username && error.errors.username.kind == 'unique') message = "ERROR.CU3: Nombre de usuario duplicado";

            if (error.name && error.code && error.name === 'MongoError' && error.code === 11000) {
              let msg = String(error.message);

              if (msg.includes("dni")) message = 'ERROR.CU1: DNI duplicado';
              else if (msg.includes("usename")) message = 'ERROR.CU2: Email duplicado';
              else if (msg.includes("email")) message = 'ERROR.CU2: Email duplicado';
              else message = 'ERROR.CU4: Clave duplicada';
            }

            reject(helper.lib.httpError(404, message));
          });

      } catch (error) {
        console.error('Helper "database.createUser" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
