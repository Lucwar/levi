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

        const { username } = req.body;

        if (!username) return reject(helper.lib.httpError(401, 'ERROR.L0: Por favor, introduzca un nombre de usuario'));

        model
          .findOne({ username })
          .then(async result => {

            if (!result) return resolve({ data: {} });

            if (!result.enabled) return reject(helper.lib.httpError(401, 'ERROR.L3: Su usuario ha sido deshabilitado'));




            const user = result.toJSON();

            const token = helper.lib.jsonwebtoken.sign({ roles: user.roles, id: user.id }, helper.settings.token.magicLink, { expiresIn: helper.settings.token.expiresIn.magicLink });

            const link = `${helper.settings.recoverPassword.host}/login/${token}`;

            const transporter = helper.lib.nodemailer.createTransport(helper.settings.nodemailer.transporter);
            const mailOptions = {
              from: helper.settings.nodemailer.mailOptions.from,
              subject: await global.helpers.translations.translate('welcomeMagicLink', [], user.language),
              to: user.emailAddress,
              html: `<div style="text-align: center;">
                <h1>${await global.helpers.translations.translate('welcomeMagicLink', [], user.language)}</h1>
                <p>${await global.helpers.translations.translate('useMagicLink', [], user.language)}</p>

                <table cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="border-radius: 10px;" bgcolor="#2E7B41">
                      <a href="${link}" target="_blank" style="padding: 8px 12px; border: 1px solid #2E7B41;border-radius: 10px;font-family: Arial, Helvetica, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                      ${await global.helpers.translations.translate('magicLinkOpenApp', [], user.language)}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>`
            };

            helper.lib.bouncer.bruteForce.reset(req);

            transporter.sendMail(mailOptions, (error, info) => (error ? reject(error) : resolve({ data: {} })));

          }).catch(e => reject(helper.lib.httpError(401, e.message || 'ERROR.0: Ocurrió un error inesperado')));

      } catch (error) {
        console.error('Helper "database.magicLink" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
