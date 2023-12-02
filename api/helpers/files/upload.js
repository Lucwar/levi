'use strict';

// Define module
module.exports = (helper) => {

  const thumb = require('node-thumbnail').thumb;

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

        if (!req.files || !req.files.file) return reject(helper.lib.httpError(400, 'ERROR.FU0: No hay archivo para subir'));


        let prefix = '';

        if (req.originalUrl) {
          const p = req.originalUrl.split('/');
          if (p.length >= 3) prefix = p[1] + '_';
        }


        const file = req.files.file;
        const tmp = file.type.split('/');

        if (tmp.length !== 2) return reject(helper.lib.httpError(400, 'ERROR.FU1: No se pudo subir el archivo'));


        let extension = tmp[1];

        if (extension === "svg+xml") extension = "svg";

        const newFileName = prefix + helper.lib.uuid.v4() + '.' + extension;

        helper.lib.fs.copyFile(file.path, helper.settings.files.path + "/" + newFileName, async error => {

          if (error) return reject(helper.lib.httpError(400, error.message || 'ERROR.FU2: No se pudo renombrar la imagen'));

          await helper.lib.fs.unlinkSync(file.path);

          if (extension.match(/(jpg|jpeg|png)$/i)) for (const size of helper.settings.files.sizes) await thumb({
            source: helper.settings.files.path + '/' + newFileName,
            destination: helper.settings.files.path + '/' + size.code,
            prefix: '',
            suffix: '',
            width: size.width
          });

          resolve({ data: { file: newFileName } });
        });

      } catch (error) {
        console.error('Helper "files.upload" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};