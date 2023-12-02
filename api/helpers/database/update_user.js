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

        const id = req.params.id || '';

        model.findOneAndUpdate({ _id: id }, req.body, { new: true, useFindAndModify: false })
          .then((result) => resolve({ data: result.toJSON() }))
          .catch(error => {

            let message = error.message || 'ERROR.0: Ocurrió un error inesperado';

            if (error.errors) {
              if (error.errors.dni && error.errors.dni.kind == 'unique') message = "ERROR.CU1: DNI duplicado";
              if (error.errors.emailAddress && error.errors.emailAddress.kind == 'unique') message = "ERROR.CU2: Email duplicado";
              if (error.errors.username && error.errors.username.kind == 'unique') message = "ERROR.CU3: Nombre de usuario duplicado";
            }

            if (error.name && error.code && error.name === 'MongoError' && error.code === 11000) {
              let msg = String(error.message);

              if (msg.includes("dni")) message = 'ERROR.CU1: DNI duplicado';
              else if (msg.includes("usename")) message = 'ERROR.CU2: Email duplicado';
              else if (msg.includes("email")) message = 'ERROR.CU2: Email duplicado';
              else message = 'ERROR.CU4: Clave duplicada';
            }

            reject(helper.lib.httpError(400, message));
          });

      } catch (error) {
        console.error('Helper "database.update" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
