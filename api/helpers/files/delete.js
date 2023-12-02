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
    return new Promise( (resolve, reject) => {
      try {

        let files = req.body;
        if (files && Array.isArray(files)) {
          files.forEach(el => {
            helper.lib.fs.unlink(`${helper.settings.files.path}/${el}`, err => {
              const i =req.body.indexOf(el);
              req.body.splice(i, 1);
            })
          });
          resolve({message: 'Los archivo fueron eliminados', files:req.body});
        } else {
          reject(helper.lib.httpError(400, error.message || 'No hay archivos a eliminar'));
        }

      } catch(error) {
        console.error('Helper "files.delete" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
